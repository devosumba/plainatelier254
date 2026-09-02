import { getOrderById, updateOrderPaymentStatus } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/sendOrderEmail";

const TRANSACTION_STATUS_URL = "https://backend.payhero.co.ke/api/v2/transaction-status";

// Give PayHero's webhook a fair chance to arrive before we start asking
// them directly, so a normal-speed payment doesn't trigger an extra API
// call on every 3s poll tick.
const FALLBACK_CHECK_AFTER_MS = 15000;

// docs.payhero.co.ke/docs/get-transaction-status
type PayheroTransactionStatus = {
  status?: string; // "QUEUED" | "SUCCESS" | "FAILED"
  provider_reference?: string; // the M-Pesa receipt number
};

async function checkPayheroTransactionStatus(
  reference: string
): Promise<PayheroTransactionStatus | null> {
  const username = process.env.PAYHERO_USERNAME;
  const password = process.env.PAYHERO_PASSWORD;
  if (!username || !password) return null;

  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  try {
    const res = await fetch(
      `${TRANSACTION_STATUS_URL}?reference=${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: authHeader },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as PayheroTransactionStatus;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let order = await getOrderById(id).catch((err) => {
    console.error("Order status lookup failed:", err);
    return null;
  });

  if (!order) {
    return Response.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  // Fallback: if PayHero's webhook hasn't resolved this order within a
  // reasonable window, ask PayHero directly rather than leaving the
  // customer stuck on "waiting" if the callback was slow or dropped.
  const pendingForMs = Date.now() - new Date(order.createdAt).getTime();
  if (
    order.paymentStatus === "pending" &&
    order.payheroTransactionReference &&
    pendingForMs > FALLBACK_CHECK_AFTER_MS
  ) {
    const txStatus = await checkPayheroTransactionStatus(order.payheroTransactionReference);

    if (txStatus?.status === "SUCCESS" || txStatus?.status === "FAILED") {
      const status = txStatus.status === "SUCCESS" ? "completed" : "failed";
      const updated = await updateOrderPaymentStatus(
        order.id,
        status,
        txStatus.provider_reference ?? null
      ).catch((err) => {
        console.error("Order status: failed to apply PayHero fallback result:", err);
        return null;
      });

      if (updated) {
        order = updated;
        if (status === "completed") {
          await sendOrderConfirmationEmail({
            orderReference: updated.id,
            customerName: updated.customerName,
            customerEmail: updated.customerEmail,
            items: updated.items,
            deliveryLabel: updated.deliveryLabel,
            deliveryFee: updated.deliveryFee,
            subtotal: updated.subtotal,
            total: updated.total,
          });
        }
      }
    }
  }

  return Response.json({
    success: true,
    status: order.paymentStatus,
    order: {
      id: order.id,
      customerName: order.customerName,
      items: order.items,
      deliveryLabel: order.deliveryLabel,
      deliveryFee: order.deliveryFee,
      subtotal: order.subtotal,
      total: order.total,
      mpesaReceipt: order.mpesaReceipt,
    },
  });
}
