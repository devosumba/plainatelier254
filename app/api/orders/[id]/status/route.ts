import { getOrderById } from "@/lib/orders";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const order = await getOrderById(id).catch((err) => {
    console.error("Order status lookup failed:", err);
    return null;
  });

  if (!order) {
    return Response.json({ success: false, error: "Order not found" }, { status: 404 });
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
