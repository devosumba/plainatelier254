import crypto from "crypto";
import { getOrderByPayheroReference, updateOrderPaymentStatus } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/sendOrderEmail";

// Confirmed against PayHero's docs (docs.payhero.co.ke/docs/payment-callback):
// the payment result is nested under `response`, and the top-level `status`
// flag only means "this callback was delivered", not "the payment succeeded"
// — that's `response.ResultCode === 0`.
type PayheroCallbackPayload = {
  forward_url?: string;
  status?: boolean;
  response?: {
    Amount?: number;
    CheckoutRequestID?: string;
    ExternalReference?: string;
    MerchantRequestID?: string;
    MpesaReceiptNumber?: string;
    Phone?: string;
    ResultCode?: number;
    ResultDesc?: string;
    Status?: string;
  };
};

const SIGNATURE_HEADERS = ["x-payhero-signature", "x-webhook-signature", "x-signature"];

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const receivedClean = signature.replace(/^sha256=/, "");

  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(receivedClean, "hex");
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  // PayHero's docs don't document a webhook signature header, so this stays
  // optional: only enforced if a secret has actually been configured.
  const secret = process.env.PAYHERO_WEBHOOK_SECRET;
  if (secret) {
    const signature = SIGNATURE_HEADERS.map((h) => request.headers.get(h)).find(
      Boolean
    ) as string | null;
    if (!verifySignature(rawBody, signature, secret)) {
      console.warn("PayHero webhook: signature verification failed.");
      return Response.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: PayheroCallbackPayload | null = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.warn("PayHero webhook: could not parse JSON body.");
    return Response.json({ success: true }); // 200 so PayHero doesn't retry forever
  }

  const result = payload?.response;
  const reference = result?.CheckoutRequestID;

  if (!reference) {
    console.warn("PayHero webhook: payload missing response.CheckoutRequestID.");
    return Response.json({ success: true });
  }

  const order = await getOrderByPayheroReference(reference).catch((err) => {
    console.error("PayHero webhook: order lookup failed:", err);
    return null;
  });

  if (!order) {
    console.warn("PayHero webhook: no order found for reference", reference);
    return Response.json({ success: true });
  }

  if (order.paymentStatus !== "pending") {
    // Already resolved — avoid re-processing on duplicate callbacks.
    return Response.json({ success: true });
  }

  const status = result?.ResultCode === 0 ? "completed" : "failed";
  console.log("PayHero webhook:", reference, "ResultCode", result?.ResultCode, "->", status);

  const updated = await updateOrderPaymentStatus(
    order.id,
    status,
    result?.MpesaReceiptNumber ?? null
  ).catch((err) => {
    console.error("PayHero webhook: failed to update order status:", err);
    return null;
  });

  if (updated && status === "completed") {
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

  return Response.json({ success: true });
}
