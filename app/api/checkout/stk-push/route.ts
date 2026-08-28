import { OrderEmailItem } from "@/lib/sendOrderEmail";
import { createOrder } from "@/lib/orders";

const DEFAULT_PAYHERO_ENDPOINT = "https://backend.payhero.co.ke/api/v2/payments";

type StkPushRequestBody = {
  phone?: string;
  amount?: number;
  orderReference?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  deliveryLabel?: string;
  deliveryFee?: number;
  subtotal?: number;
  items?: OrderEmailItem[];
};

function normalizeKenyanPhone(phone: string): string | null {
  let normalized = phone.replace(/[\s-]/g, "");

  if (normalized.startsWith("+254")) {
    normalized = normalized.slice(1);
  } else if (normalized.startsWith("07") || normalized.startsWith("01")) {
    normalized = `254${normalized.slice(1)}`;
  }

  if (!/^254[0-9]{9}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as StkPushRequestBody | null;

  if (!body || !body.phone || !body.amount || !body.orderReference) {
    return Response.json(
      { success: false, error: "Missing phone, amount, or orderReference." },
      { status: 400 }
    );
  }

  const phone = normalizeKenyanPhone(body.phone);
  if (!phone) {
    return Response.json(
      {
        success: false,
        error: "Invalid Kenyan phone number. Use 07XXXXXXXX or +254XXXXXXXXX.",
      },
      { status: 400 }
    );
  }

  const username = process.env.PAYHERO_USERNAME;
  const password = process.env.PAYHERO_PASSWORD;
  const channelId = process.env.PAYHERO_CHANNEL_ID;
  const endpoint = process.env.PAYHERO_ENDPOINT || DEFAULT_PAYHERO_ENDPOINT;

  if (!username || !password || !channelId) {
    return Response.json(
      {
        success: false,
        code: "not_configured",
        error:
          "PayHero isn't configured yet. Set PAYHERO_USERNAME, PAYHERO_PASSWORD and PAYHERO_CHANNEL_ID to enable live M-Pesa payments.",
      },
      { status: 503 }
    );
  }

  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const callbackUrl = `${siteUrl}/api/payhero/webhook`;

  try {
    const payheroResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(body.amount),
        phone_number: phone,
        channel_id: Number(channelId),
        provider: "m-pesa",
        external_reference: body.orderReference,
        description: body.description ?? `Watendawili order ${body.orderReference}`,
        callback_url: callbackUrl,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await payheroResponse.json().catch(() => null);

    if (!payheroResponse.ok || !data?.CheckoutRequestID) {
      console.error(
        "PayHero STK push declined:",
        payheroResponse.status,
        JSON.stringify(data)
      );
      return Response.json(
        {
          success: false,
          error: data?.ResponseDescription || "PayHero declined the STK push request.",
        },
        { status: 502 }
      );
    }

    // Persist the order as "pending" now, keyed by our own order reference,
    // with PayHero's CheckoutRequestID stored so the webhook can find it
    // again when the real payment result comes back.
    if (body.customerEmail && body.items && body.items.length > 0) {
      try {
        await createOrder({
          id: body.orderReference,
          customerName: body.customerName ?? "there",
          customerEmail: body.customerEmail,
          customerPhone: phone,
          items: body.items,
          deliveryLabel: body.deliveryLabel ?? "Delivery",
          deliveryFee: body.deliveryFee ?? 0,
          subtotal: body.subtotal ?? 0,
          total: body.amount,
          payheroReference: data.CheckoutRequestID,
        });
      } catch (err) {
        // The STK push already went out to the customer's phone — don't fail
        // the response over a DB hiccup, just log it for investigation.
        console.error("Failed to persist order:", err);
      }
    }

    return Response.json({
      success: true,
      orderId: body.orderReference,
      checkoutRequestId: data.CheckoutRequestID,
      message:
        data.CustomerMessage || "STK push sent. Check your phone to complete payment.",
    });
  } catch {
    return Response.json(
      { success: false, error: "Could not reach PayHero. Please try again." },
      { status: 502 }
    );
  }
}
