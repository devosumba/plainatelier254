import crypto from "crypto";
import { getOrderByPayheroReference, updateOrderPaymentStatus } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/sendOrderEmail";

// PayHero's public docs don't spell out an exact webhook payload shape or a
// signature header name, so this parses defensively: it checks several
// plausible field names, and a couple of common nesting wrappers, rather
// than assuming one exact structure. If you see a real callback payload
// land (check the Vercel function logs), tighten this to match exactly.

const REFERENCE_KEYS = [
  "CheckoutRequestID",
  "checkout_request_id",
  "external_reference",
  "ExternalReference",
  "reference",
];

const SUCCESS_KEYS = ["ResultCode", "Status", "status", "success", "paymentSuccess"];
const RECEIPT_KEYS = ["MpesaReceiptNumber", "mpesa_receipt", "receipt_number"];

const SIGNATURE_HEADERS = [
  "x-payhero-signature",
  "x-webhook-signature",
  "x-signature",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function firstDefined(sources: AnyRecord[], keys: string[]): unknown {
  for (const source of sources) {
    for (const key of keys) {
      if (source && source[key] !== undefined && source[key] !== null) {
        return source[key];
      }
    }
  }
  return undefined;
}

function isSuccessValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "success" ||
      normalized === "completed" ||
      normalized === "true" ||
      normalized === "0"
    );
  }
  return false;
}

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

  let payload: AnyRecord | null = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    payload = null;
  }

  if (!payload) {
    console.warn("PayHero webhook: could not parse JSON body.");
    return Response.json({ success: true }); // 200 so PayHero doesn't retry forever
  }

  console.log("PayHero webhook received:", JSON.stringify(payload));

  const sources = [payload, payload.response, payload.data, payload.payment].filter(
    Boolean
  ) as AnyRecord[];

  const reference = firstDefined(sources, REFERENCE_KEYS);
  if (!reference || typeof reference !== "string") {
    console.warn("PayHero webhook: no recognizable reference field in payload.");
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

  const successValue = firstDefined(sources, SUCCESS_KEYS);
  const receipt = firstDefined(sources, RECEIPT_KEYS) as string | undefined;
  const status = isSuccessValue(successValue) ? "completed" : "failed";

  const updated = await updateOrderPaymentStatus(order.id, status, receipt ?? null).catch(
    (err) => {
      console.error("PayHero webhook: failed to update order status:", err);
      return null;
    }
  );

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
