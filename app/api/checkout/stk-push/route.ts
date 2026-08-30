import { createOrder } from "@/lib/orders";
import { getProductById } from "@/lib/products";
import { deliveryOptions, DeliveryOptionId } from "@/lib/delivery";

const DEFAULT_PAYHERO_ENDPOINT = "https://backend.payhero.co.ke/api/v2/payments";

type CartItemInput = {
  productId?: string;
  size?: string;
  quantity?: number;
};

type StkPushRequestBody = {
  phone?: string;
  orderReference?: string;
  customerName?: string;
  customerEmail?: string;
  deliveryOptionId?: DeliveryOptionId;
  items?: CartItemInput[];
};

// PayHero's docs (docs.payhero.co.ke/docs/post-initiate-mpesa-stk-push-request)
// show phone_number in local format, e.g. "0787677676" — not the 254-prefixed
// international format.
function normalizeKenyanPhone(phone: string): string | null {
  let normalized = phone.replace(/[\s-]/g, "");

  if (normalized.startsWith("+254")) {
    normalized = `0${normalized.slice(4)}`;
  } else if (normalized.startsWith("254")) {
    normalized = `0${normalized.slice(3)}`;
  }

  if (!/^0[17][0-9]{8}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as StkPushRequestBody | null;

  if (
    !body ||
    !body.phone ||
    !body.orderReference ||
    !body.deliveryOptionId ||
    !body.items ||
    body.items.length === 0
  ) {
    return Response.json(
      { success: false, error: "Missing phone, delivery option, or cart items." },
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

  const delivery = deliveryOptions.find((d) => d.id === body.deliveryOptionId);
  if (!delivery) {
    return Response.json(
      { success: false, error: "Invalid delivery option." },
      { status: 400 }
    );
  }

  // Never trust prices, names, or a total from the client — look every line
  // up against the real product catalog and compute the amount server-side,
  // so a tampered request can't change what actually gets charged.
  const orderItems: {
    name: string;
    size?: string;
    fabricColor?: string;
    quantity: number;
    price: number;
  }[] = [];

  for (const line of body.items) {
    const quantity = Number(line.quantity);
    if (!line.productId || !Number.isInteger(quantity) || quantity < 1) {
      return Response.json(
        { success: false, error: "Invalid item in cart." },
        { status: 400 }
      );
    }
    const product = getProductById(line.productId);
    if (!product || !product.inStock) {
      return Response.json(
        { success: false, error: "One of the items in your cart is no longer available." },
        { status: 400 }
      );
    }
    orderItems.push({
      name: product.name,
      size: line.size,
      fabricColor: product.fabricColor,
      quantity,
      price: product.price,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + delivery.fee;

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
        amount: total,
        phone_number: phone,
        channel_id: Number(channelId),
        provider: "m-pesa",
        external_reference: body.orderReference,
        customer_name: body.customerName,
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
          error:
            "We couldn't reach M-Pesa. Please check your number and try again.",
        },
        { status: 502 }
      );
    }

    // TEMPORARY TEST MODE — set SKIP_DB_PERSISTENCE=true to isolate the
    // PayHero STK push/webhook flow from the database entirely, for
    // debugging. Strip this block (and the matching one in the webhook
    // route) out once the two are confirmed working independently.
    const skipDb = process.env.SKIP_DB_PERSISTENCE === "true";

    if (!skipDb) {
      // Persist the order as "pending" now, keyed by our own order reference,
      // with PayHero's CheckoutRequestID stored so the webhook can find it
      // again when the real payment result comes back.
      if (body.customerEmail) {
        try {
          await createOrder({
            id: body.orderReference,
            customerName: body.customerName ?? "there",
            customerEmail: body.customerEmail,
            customerPhone: phone,
            items: orderItems,
            deliveryLabel: delivery.label,
            deliveryFee: delivery.fee,
            subtotal,
            total,
            payheroReference: data.CheckoutRequestID,
          });
        } catch (err) {
          // The STK push already went out to the customer's phone — don't fail
          // the response over a DB hiccup, just log it for investigation.
          console.error("Failed to persist order:", err);
        }
      }
    }

    return Response.json({
      success: true,
      testMode: skipDb,
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
