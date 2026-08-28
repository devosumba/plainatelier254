"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { deliveryOptions, DeliveryOptionId } from "@/lib/delivery";
import { CartLine, lineKey } from "@/lib/types";
import Navbar from "@/components/layout/Navbar";
import PillButton from "@/components/ui/PillButton";
import { CartIcon, CheckIcon, AlertIcon } from "@/components/ui/icons";

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-forest-900 px-4 py-3 text-sm text-cream placeholder:text-sage-dim focus:border-cream/40 focus:outline-none";

type SubmitState = "idle" | "pending" | "success" | "error";

type OrderSnapshot = {
  lines: CartLine[];
  subtotal: number;
  deliveryLabel: string;
  deliveryFee: number;
  total: number;
};

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
  const [successMessage, setSuccessMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);

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
    submitState !== "pending";

  async function handleCompleteOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedDelivery) return;

    setSubmitState("pending");
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
          description: `Watendawili order ${reference} — ${firstName} ${lastName}`,
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
        setSubmitState("success");
        setSuccessMessage(data.message || "STK push sent. Check your phone.");
        clearCart();
      } else {
        setSubmitState("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Could not reach the server. Please try again.");
    }
  }

  if (submitState === "success" && orderSnapshot) {
    return (
      <>
        <Navbar />
        <main className="flex-1 px-3 pb-24 pt-28 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-forest-950">
              <CheckIcon className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
              Order sent
            </h1>
            <p className="mt-3 max-w-md text-sm text-sage">{successMessage}</p>
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
                  Total
                </span>
                <span className="font-display text-xl font-semibold text-cream">
                  {formatPrice(orderSnapshot.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <PillButton href="/#shop">Back to Shop</PillButton>
          </div>
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
                {submitState === "pending" ? "Sending request…" : "Complete Order"}
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
