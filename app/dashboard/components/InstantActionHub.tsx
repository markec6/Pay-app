"use client";

import { motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import type { DashboardCurrency, DashboardModalView } from "../lib/dashboardTypes";
import { getCurrencyPrefix } from "../lib/exchangeRates";
import { AddCardIcon, BillIcon, MotionCard, WalletIcon } from "./DashboardPrimitives";
import { DashboardModal } from "./DashboardModal";

const actions = [
  {
    id: "bill-payment",
    title: "Bill Payment",
    subtitle: "Pay providers with a clean guided workflow.",
    icon: BillIcon,
  },
  {
    id: "withdraw",
    title: "Withdraw Money",
    subtitle: "Prepare a transfer to your linked bank rails.",
    icon: WalletIcon,
  },
  {
    id: "add-card",
    title: "Add Card",
    subtitle: "Connect a new card for instant spending.",
    icon: AddCardIcon,
  },
] as const;

const bankDestinations = [
  "Main Street Bank",
  "Apex Horizon Fund",
  "Silicon Valley Trust",
  "Continental Reserve",
] as const;

type BankDestination = (typeof bankDestinations)[number];

function formatLinkedCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const visibleDigits = digits.slice(-4);

  if (visibleDigits.length === 0) return "•••• •••• •••• ••••";

  return `•••• ${visibleDigits.padStart(4, "•")}`;
}

export function InstantActionHub({
  activeModal,
  setActiveModal,
  onBillPayment,
  onLinkCard,
  onWithdraw,
  activeCurrency,
}: {
  activeModal: DashboardModalView;
  setActiveModal: (view: DashboardModalView) => void;
  onBillPayment: (amount: number) => void;
  onLinkCard: (holder: string, number: string) => void;
  onWithdraw: (amount: number, bankName: string) => void;
  activeCurrency: DashboardCurrency;
}) {
  const [accountNumber, setAccountNumber] = useState("");
  const [providerName, setProviderName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [selectedBank, setSelectedBank] =
    useState<BankDestination>(bankDestinations[0]);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) return;

    onBillPayment(amount);
    setActiveModal("success");
    setAccountNumber("");
    setProviderName("");
    setPaymentAmount("");
  }

  function handleAddCardSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const holder = cardholderName.trim();
    const formattedNumber = formatLinkedCardNumber(cardNumber);

    if (!holder || formattedNumber === "•••• •••• •••• ••••") return;

    onLinkCard(holder, formattedNumber);
    setCardholderName("");
    setCardNumber("");
    setActiveModal(null);
  }

  function handleWithdrawSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(withdrawAmount);

    if (!Number.isFinite(amount) || amount <= 0) return;

    onWithdraw(amount, selectedBank);
    setWithdrawAmount("");
    setSelectedBank(bankDestinations[0]);
    setActiveModal(null);
  }

  const modalOpen = activeModal !== null;
  const titleId = `${activeModal ?? "dashboard"}-modal-title`;
  const currencyPrefix = getCurrencyPrefix(activeCurrency);

  return (
    <>
      <MotionCard className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              Instant Action Hub
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
              Automated overlay workflows
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
            Tap a control card to preview the dashboard interaction layer.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.id}
                type="button"
                className="group relative overflow-hidden rounded-3xl border border-neutral-100 bg-white p-5 text-left shadow-[0_14px_45px_-28px_rgba(26,26,46,0.5)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(26,26,46,0.65)]"
                onClick={() => setActiveModal(action.id)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#3DAB6B]/10 blur-2xl transition group-hover:bg-[#3DAB6B]/20" />
                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3DAB6B]/10 text-[#3DAB6B]">
                    <Icon className="h-9 w-9" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1a1a2e]">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {action.subtitle}
                  </p>
                  <div className="mt-5 rounded-2xl bg-[#f9fafb] p-3">
                    <div className="flex items-center justify-between">
                      <span className="h-2 w-20 rounded-full bg-neutral-200" />
                      <span className="h-8 w-8 rounded-full bg-[#3DAB6B]" />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#3DAB6B]/20">
                      <span className="block h-full w-2/3 rounded-full bg-[#3DAB6B]" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </MotionCard>

      <DashboardModal
        open={modalOpen}
        titleId={titleId}
        onClose={() => setActiveModal(null)}
      >
        {activeModal === "bill-payment" ? (
          <form onSubmit={handleSubmit}>
            <h2 id={titleId} className="text-2xl font-extrabold text-[#1a1a2e]">
              Bill Payment
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Enter provider details to simulate a client-side payment preview.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Account Number
                </span>
                <input
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#3DAB6B]"
                  placeholder="Enter account number"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Provider Name
                </span>
                <input
                  value={providerName}
                  onChange={(event) => setProviderName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#3DAB6B]"
                  placeholder="Enter provider name"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Payment Amount
                </span>
                <input
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#3DAB6B]"
                  placeholder="Enter payment amount"
                  inputMode="decimal"
                  required
                />
              </label>
            </div>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                className="min-h-[46px] flex-1 rounded-full border border-neutral-200 px-5 text-sm font-bold text-[#1a1a2e]"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[46px] flex-1 rounded-full bg-[#3DAB6B] px-5 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(61,171,107,0.55)]"
              >
                Pay Now
              </button>
            </div>
          </form>
        ) : null}

        {activeModal === "success" ? (
          <div className="py-4 text-center">
            <motion.div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#3DAB6B]/10 text-[#3DAB6B]"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.svg
                viewBox="0 0 52 52"
                className="h-14 w-14"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M14 27l8 8 17-19"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                />
              </motion.svg>
            </motion.div>
            <h2 id={titleId} className="mt-6 text-3xl font-extrabold text-[#1a1a2e]">
              Transfer successfully done
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Your preview wallet balance has been updated locally.
            </p>
            <button
              type="button"
              className="mt-7 min-h-[46px] rounded-full bg-[#3DAB6B] px-8 text-sm font-bold text-white"
              onClick={() => setActiveModal(null)}
            >
              Close
            </button>
          </div>
        ) : null}

        {activeModal === "withdraw" ? (
          <form onSubmit={handleWithdrawSubmit}>
            <h2 id={titleId} className="text-2xl font-extrabold text-[#1a1a2e]">
              Withdraw Money
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Select a destination and simulate a cash-out from your main
              wallet balance.
            </p>

            <div className="mt-6 rounded-3xl bg-[#f9fafb] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e85d6f]/10 text-sm font-black text-[#e85d6f]">
                  BW
                </div>
                <div>
                  <p className="text-sm font-black text-[#1a1a2e]">
                    Cash-out preview
                  </p>
                  <p className="text-xs font-medium text-neutral-500">
                    No database changes will be made.
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Select Bank Destination
                </span>
                <select
                  value={selectedBank}
                  onChange={(event) =>
                    setSelectedBank(event.target.value as BankDestination)
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-[#1a1a2e] outline-none transition focus:border-[#3DAB6B]"
                >
                  {bankDestinations.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Amount to Withdraw
                </span>
                <div className="mt-2 flex items-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 transition focus-within:border-[#3DAB6B]">
                  <span className="mr-2 text-sm font-black text-neutral-400">
                    {currencyPrefix}
                  </span>
                  <input
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#1a1a2e] outline-none"
                    placeholder="0.00"
                    inputMode="decimal"
                    required
                  />
                </div>
              </label>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                className="min-h-[46px] flex-1 rounded-full border border-neutral-200 px-5 text-sm font-bold text-[#1a1a2e]"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[46px] flex-1 rounded-full bg-[#3DAB6B] px-5 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(61,171,107,0.55)]"
              >
                Withdraw Now
              </button>
            </div>
          </form>
        ) : null}

        {activeModal === "add-card" ? (
          <form onSubmit={handleAddCardSubmit}>
            <h2 id={titleId} className="text-2xl font-extrabold text-[#1a1a2e]">
              Add Card
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Link a card locally and update the first connected card preview
              instantly.
            </p>

            <div className="mt-6 rounded-3xl bg-[#f9fafb] p-5">
              <div className="mb-5 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1a1a2e] via-[#273056] to-[#3DAB6B] p-5 text-white shadow-[0_18px_44px_-18px_rgba(26,26,46,0.65)]">
                <div className="flex items-center justify-between">
                  <span className="h-8 w-12 rounded-lg bg-white/30" />
                  <span className="text-xs font-black tracking-[0.18em]">
                    VISA
                  </span>
                </div>
                <p className="mt-8 font-mono text-lg font-bold tracking-[0.25em]">
                  {formatLinkedCardNumber(cardNumber)}
                </p>
                <p className="mt-4 text-sm font-bold">
                  {cardholderName.trim() || "Cardholder Name"}
                </p>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Cardholder Name
                </span>
                <input
                  value={cardholderName}
                  onChange={(event) => setCardholderName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3DAB6B]"
                  placeholder="e.g., John Doe"
                  required
                />
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-[#1a1a2e]">
                  Card Number
                </span>
                <input
                  value={cardNumber}
                  onChange={(event) =>
                    setCardNumber(event.target.value.replace(/\D/g, "").slice(0, 16))
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-[#3DAB6B]"
                  placeholder="•••• •••• •••• ••••"
                  inputMode="numeric"
                  required
                />
              </label>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                className="min-h-[46px] flex-1 rounded-full border border-neutral-200 px-5 text-sm font-bold text-[#1a1a2e]"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[46px] flex-1 rounded-full bg-[#3DAB6B] px-5 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(61,171,107,0.55)]"
              >
                Link Card
              </button>
            </div>
          </form>
        ) : null}
      </DashboardModal>
    </>
  );
}
