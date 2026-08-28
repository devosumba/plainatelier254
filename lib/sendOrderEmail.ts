const DEFAULT_RESEND_FROM = "Watendawili <onboarding@resend.dev>";
const BOOKINGS_INBOX = "watendawilibookings@gmail.com";

export type OrderEmailItem = {
  name: string;
  size?: string;
  fabricColor?: string;
  quantity: number;
  price: number;
};

export type OrderEmailPayload = {
  orderReference: string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  deliveryLabel: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
};

function formatKsh(amount: number): string {
  return `Ksh ${amount.toLocaleString("en-KE")}`;
}

function buildEmailHtml(order: OrderEmailPayload): string {
  const rows = order.items
    .map((item) => {
      const variant = [item.fabricColor, item.size ? `Size ${item.size}` : null]
        .filter(Boolean)
        .join(" · ");
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">
            <div style="font-weight:600;">${item.name}</div>
            ${variant ? `<div style="color:#666;font-size:13px;">${variant}</div>` : ""}
            <div style="color:#666;font-size:13px;">Qty ${item.quantity}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;">
            ${formatKsh(item.price * item.quantity)}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111;">
      <h1 style="font-size:20px;">Watendawili order ${order.orderReference}</h1>
      <p>Thanks, ${order.customerName}. Here's what was ordered:</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        ${rows}
      </table>
      <table style="width:100%;margin-top:16px;font-size:14px;">
        <tr><td>Subtotal</td><td style="text-align:right;">${formatKsh(order.subtotal)}</td></tr>
        <tr><td>Delivery (${order.deliveryLabel})</td><td style="text-align:right;">${formatKsh(order.deliveryFee)}</td></tr>
        <tr style="font-weight:700;font-size:16px;">
          <td style="padding-top:8px;">Total</td>
          <td style="text-align:right;padding-top:8px;">${formatKsh(order.total)}</td>
        </tr>
      </table>
      <p style="margin-top:24px;color:#666;font-size:12px;">
        Watendawili — Nairobi, Kenya
      </p>
    </div>`;
}

/**
 * Sends an order confirmation email to the customer and the Watendawili
 * bookings inbox via Resend. Best-effort: failures are logged, not thrown,
 * since a flaky email send shouldn't undo an already-placed order.
 */
export async function sendOrderConfirmationEmail(order: OrderEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping order confirmation email.");
    return;
  }

  const from = process.env.RESEND_FROM || DEFAULT_RESEND_FROM;
  const html = buildEmailHtml(order);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [order.customerEmail, BOOKINGS_INBOX],
        subject: `Watendawili order ${order.orderReference} confirmed`,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Resend email send failed:", res.status, body);
    }
  } catch (err) {
    console.error("Resend email send error:", err);
  }
}
