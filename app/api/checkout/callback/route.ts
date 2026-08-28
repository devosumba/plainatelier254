// PayHero calls this endpoint once the customer completes (or cancels) the
// M-Pesa STK push prompt. There's no database in this project to persist
// order/payment state against, so this is a stub: it accepts the callback
// so PayHero doesn't retry, and logs the result for now. Once real orders
// are persisted somewhere, look up the order by CheckoutRequestID here and
// update its status.
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (payload) {
    console.log("PayHero callback received:", payload);
  }

  return Response.json({ success: true });
}
