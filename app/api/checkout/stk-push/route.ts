const DEFAULT_PAYHERO_ENDPOINT = "https://backend.payhero.co.ke/api/v2/payments";

type StkPushRequestBody = {
  phone?: string;
  amount?: number;
  orderReference?: string;
  description?: string;
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
  const callbackUrl = `${new URL(request.url).origin}/api/checkout/callback`;

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
      return Response.json(
        {
          success: false,
          error: data?.ResponseDescription || "PayHero declined the STK push request.",
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
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
