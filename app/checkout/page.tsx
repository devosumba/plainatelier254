"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { deliveryOptions, DeliveryOptionId } from "@/lib/delivery";
import { CartLine, lineKey } from "@/lib/types";
import Navbar from "@/components/layout/Navbar";
import PillButton from "@/components/ui/PillButton";
import { CartIcon, CheckIcon, AlertIcon } from "@/components/ui/icons";
import Loader from "@/components/ui/Loader";

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-forest-900 px-4 py-3 text-sm text-cream placeholder:text-sage-dim focus:border-cream/40 focus:outline-none";

type SubmitState = "idle" | "sending" | "waiting" | "completed" | "failed" | "error";

type OrderSnapshot = {
  lines: CartLine[];
  subtotal: number;
  deliveryLabel: string;
  deliveryFee: number;
  total: number;
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000;

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryOptionId, setDeliveryOptionId] = useState<DeliveryOptionId | null>(
    null
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  // TEMPORARY TEST MODE — mirrors SKIP_DB_PERSISTENCE on the server. Strip
  // this out once the STK push/webhook flow is confirmed working without it.
  const [testMode, setTestMode] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadlineRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedDelivery = deliveryOptions.find((d) => d.id === deliveryOptionId);
  const deliveryFee = selectedDelivery?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const canSubmit =
    lines.length > 0 &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    deliveryOptionId !== null &&
    submitState !== "sending" &&
    submitState !== "waiting";

  function stopPolling() {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (pollDeadlineRef.current) clearTimeout(pollDeadlineRef.current);
    pollIntervalRef.current = null;
    pollDeadlineRef.current = null;
  }

  useEffect(() => stopPolling, []);

  function startPolling(orderId: string) {
    setPollTimedOut(false);

    async function poll() {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();
        if (!data.success) return;

        if (data.status === "completed") {
          stopPolling();
          setSubmitState("completed");
        } else if (data.status === "failed") {
          stopPolling();
          setSubmitState("failed");
        }
      } catch {
        // transient network hiccup while polling — try again next interval
      }
    }

    poll();
    pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    pollDeadlineRef.current = setTimeout(() => {
      stopPolling();
      setPollTimedOut(true);
    }, POLL_TIMEOUT_MS);
  }

  async function handleCompleteOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedDelivery) return;

    setSubmitState("sending");
    setErrorMessage("");

    // Only ever runs inside this submit handler, never during render.
    // eslint-disable-next-line react-hooks/purity
    const reference = `WTD-${Date.now().toString(36).toUpperCase()}`;
    setOrderReference(reference);

    try {
      const res = await fetch("/api/checkout/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: total,
          orderReference: reference,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          deliveryLabel: selectedDelivery.label,
          deliveryFee: selectedDelivery.fee,
          subtotal,
          items: lines.map((line) => ({
            name: line.product.name,
            size: line.size,
            fabricColor: line.product.fabricColor,
            quantity: line.quantity,
            price: line.product.price,
          })),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setOrderSnapshot({
          lines,
          subtotal,
          deliveryLabel: selectedDelivery.label,
          deliveryFee: selectedDelivery.fee,
          total,
        });
        setStatusMessage(data.message || "STK push sent. Check your phone.");
        setSubmitState("waiting");
        setTestMode(!!data.testMode);
        clearCart();
        if (!data.testMode) {
          startPolling(reference);
        }
      } else {
        setSubmitState("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Could not reach the server. Please try again.");
    }
  }

  const isResolving = submitState === "waiting" || submitState === "completed" || submitState === "failed";

  if (isResolving && orderSnapshot) {
    return (
      <>
        <Navbar />
        <main className="flex-1 px-3 pb-24 pt-28 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            {submitState === "waiting" && testMode && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/25 text-cream">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
                  Test mode: STK push sent
                </h1>
                <p className="mt-3 max-w-md text-sm text-sage">
                  Database persistence is disabled (SKIP_DB_PERSISTENCE=true),
                  so this page isn&apos;t polling for a result. Check the
                  server logs for the webhook callback.
                </p>
              </>
            )}

            {submitState === "waiting" && !testMode && (
              <>
                <Loader size={72} className="rounded-full" />
                <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
                  Waiting for M-Pesa confirmation
                </h1>
                <p className="mt-3 max-w-md text-sm text-sage">{statusMessage}</p>
                <p className="mt-1 text-xs text-sage-dim">
                  Enter your M-Pesa PIN on your phone to complete the payment.
                  This page will update automatically.
                </p>
                {pollTimedOut && (
                  <p className="mt-4 max-w-sm text-xs text-sage-dim">
                    Still waiting on confirmation, this is taking longer than
                    usual. You&apos;ll get an email at {email} once it&apos;s
                    confirmed, or you can check back on this order later.
                  </p>
                )}
              </>
            )}

            {submitState === "completed" && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-forest-950">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
                  Payment confirmed
                </h1>
                <p className="mt-3 max-w-md text-sm text-sage">
                  Thanks! Your M-Pesa payment went through and your order is
                  confirmed. A receipt has been emailed to you.
                </p>
              </>
            )}

            {submitState === "failed" && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/25 text-cream">
                  <AlertIcon className="h-7 w-7" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
                  Payment didn&apos;t go through
                </h1>
                <p className="mt-3 max-w-md text-sm text-sage">
                  The M-Pesa payment wasn&apos;t completed or was cancelled.
                  No charge was made. You can head back to the shop and try
                  again.
                </p>
              </>
            )}

            <p className="mt-1 text-xs text-sage-dim">
              Order reference: {orderReference}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-[2rem] border border-cream/15 bg-forest-900 p-6 text-left">
            <h2 className="font-display text-lg font-semibold">
              Order summary
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {orderSnapshot.lines.map((line) => (
                <div
                  key={lineKey(line.product.id, line.size)}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cream">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-sage-dim">
                      {[
                        line.product.fabricColor,
                        line.size ? `Size ${line.size}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      {line.product.fabricColor || line.size ? " · " : ""}
                      Qty {line.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium text-cream">
                    {formatPrice(line.product.price * line.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-cream/10 pt-4 text-sm">
              <div className="flex items-center justify-between text-sage">
                <span>Subtotal</span>
                <span className="text-cream">
                  {formatPrice(orderSnapshot.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sage">
                <span>Delivery ({orderSnapshot.deliveryLabel})</span>
                <span className="text-cream">
                  {formatPrice(orderSnapshot.deliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-cream/10 pt-3">
                <span className="font-display text-base font-semibold text-cream">
                  {submitState === "completed" ? "Total paid" : "Total"}
                </span>
                <span className="font-display text-xl font-semibold text-cream">
                  {formatPrice(orderSnapshot.total)}
                </span>
              </div>
            </div>
          </div>

          {(submitState === "completed" || submitState === "failed") && (
            <div className="mt-8 flex justify-center">
              <PillButton href="/#shop">Back to Shop</PillButton>
            </div>
          )}
        </main>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-40 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/15 text-sage">
            <CartIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-md text-sm text-sage">
            Add something unnecessarily good before you check out.
          </p>
          <PillButton href="/#shop" className="mt-8">
            Browse Merch
          </PillButton>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 px-3 pb-24 pt-28 sm:px-6 lg:px-10">
        <Link
          href="/#shop"
          className="text-sm text-sage-dim transition-colors hover:text-cream"
        >
          &larr; Back to Shop
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
          Checkout
        </h1>

        <form
          onSubmit={handleCompleteOrder}
          className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="font-display text-lg font-semibold">
                Customer details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClasses}
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClasses}
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`sm:col-span-2 ${inputClasses}`}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone number (for M-Pesa)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`sm:col-span-2 ${inputClasses}`}
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold">
                Delivery type
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDeliveryOptionId(option.id)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      deliveryOptionId === option.id
                        ? "border-cream bg-cream text-forest-950"
                        : "border-cream/15 text-cream hover:border-cream/40"
                    }`}
                  >
                    <p className="font-display text-sm font-semibold">
                      {option.label}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        deliveryOptionId === option.id
                          ? "text-forest-950/70"
                          : "text-sage-dim"
                      }`}
                    >
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col">
            <div className="rounded-[2rem] border border-cream/15 bg-forest-900 p-6">
              <h2 className="font-display text-lg font-semibold">
                Order summary
              </h2>

              <div className="mt-4 flex flex-col gap-4">
                {lines.map((line) => (
                  <div
                    key={lineKey(line.product.id, line.size)}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-cream">
                        {line.product.name}
                      </p>
                      <p className="text-xs text-sage-dim">
                        {[
                          line.product.fabricColor,
                          line.size ? `Size ${line.size}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        {line.product.fabricColor || line.size ? " · " : ""}
                        Qty {line.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-medium text-cream">
                      {formatPrice(line.product.price * line.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-cream/10 pt-4 text-sm">
                <div className="flex items-center justify-between text-sage">
                  <span>Subtotal</span>
                  <span className="text-cream">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sage">
                  <span>Delivery</span>
                  <span className="text-cream">
                    {selectedDelivery
                      ? formatPrice(selectedDelivery.fee)
                      : "Select an option"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-cream/10 pt-3">
                  <span className="font-display text-base font-semibold text-cream">
                    Total
                  </span>
                  <span className="font-display text-xl font-semibold text-cream">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {submitState === "error" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-cream/15 bg-forest-950 p-3 text-xs text-sage">
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-cream" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <PillButton
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full"
              >
                {submitState === "sending" ? "Sending request…" : "Complete Order"}
              </PillButton>

              <p className="mt-3 text-center text-[11px] text-sage-dim">
                You&apos;ll get an M-Pesa prompt on your phone to complete
                payment.
              </p>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
