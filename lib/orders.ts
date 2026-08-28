import { sql, ensureSchema } from "@/lib/db";
import { OrderEmailItem } from "@/lib/sendOrderEmail";

export type PaymentStatus = "pending" | "completed" | "failed";

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderEmailItem[];
  sizes: string | null;
  deliveryLabel: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentStatus: PaymentStatus;
  payheroReference: string | null;
  mpesaReceipt: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderEmailItem[];
  sizes: string | null;
  delivery_label: string;
  delivery_fee: number;
  subtotal: number;
  total: number;
  payment_status: PaymentStatus;
  payhero_reference: string | null;
  mpesa_receipt: string | null;
  created_at: string;
  updated_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    items: row.items,
    sizes: row.sizes,
    deliveryLabel: row.delivery_label,
    deliveryFee: row.delivery_fee,
    subtotal: row.subtotal,
    total: row.total,
    paymentStatus: row.payment_status,
    payheroReference: row.payhero_reference,
    mpesaReceipt: row.mpesa_receipt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createOrder(params: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderEmailItem[];
  deliveryLabel: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  payheroReference: string;
}): Promise<Order> {
  await ensureSchema();

  const sizes = [...new Set(params.items.map((i) => i.size).filter(Boolean))].join(
    ", "
  );

  const rows = (await sql`
    INSERT INTO orders (
      id, customer_name, customer_email, customer_phone, items, sizes,
      delivery_label, delivery_fee, subtotal, total, payment_status,
      payhero_reference
    ) VALUES (
      ${params.id}, ${params.customerName}, ${params.customerEmail},
      ${params.customerPhone}, ${JSON.stringify(params.items)}, ${sizes || null},
      ${params.deliveryLabel}, ${params.deliveryFee}, ${params.subtotal},
      ${params.total}, 'pending', ${params.payheroReference}
    )
    ON CONFLICT (id) DO UPDATE SET payhero_reference = EXCLUDED.payhero_reference
    RETURNING *
  `) as unknown as OrderRow[];

  return rowToOrder(rows[0]);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureSchema();
  const rows = (await sql`
    SELECT * FROM orders WHERE id = ${id} LIMIT 1
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrderByPayheroReference(
  reference: string
): Promise<Order | null> {
  await ensureSchema();
  const rows = (await sql`
    SELECT * FROM orders WHERE payhero_reference = ${reference} LIMIT 1
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function updateOrderPaymentStatus(
  id: string,
  status: PaymentStatus,
  mpesaReceipt?: string | null
): Promise<Order | null> {
  await ensureSchema();
  const rows = (await sql`
    UPDATE orders
    SET payment_status = ${status},
        mpesa_receipt = COALESCE(${mpesaReceipt ?? null}, mpesa_receipt),
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}
