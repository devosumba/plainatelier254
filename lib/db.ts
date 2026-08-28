import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or POSTGRES_URL) is not set. Connect a Postgres database to this project."
  );
}

export const sql = neon(connectionString);

let schemaReady: Promise<void> | null = null;

/**
 * Creates the orders table if it doesn't exist yet. Cheap to call on every
 * cold start (IF NOT EXISTS), memoized per warm instance so it only runs
 * once per lambda lifetime.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        items JSONB NOT NULL,
        sizes TEXT,
        delivery_label TEXT NOT NULL,
        delivery_fee INTEGER NOT NULL,
        subtotal INTEGER NOT NULL,
        total INTEGER NOT NULL,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        payhero_reference TEXT,
        mpesa_receipt TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => {
      return sql`
        CREATE INDEX IF NOT EXISTS idx_orders_payhero_reference
        ON orders (payhero_reference)
      `;
    }).then(() => undefined);
  }
  return schemaReady;
}
