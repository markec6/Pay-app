"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { createMockTransactions } from "../lib/mockTransactions";
import type {
  DashboardCurrency,
  DashboardModalView,
  DashboardTransaction,
  PaymentCard,
} from "../lib/dashboardTypes";
import {
  MotionSection,
  SectionEyebrow,
  dashboardContainerVariants,
  dashboardItemVariants,
} from "./DashboardPrimitives";
import { InstantActionHub } from "./InstantActionHub";
import { LiveActivityMonitor } from "./LiveActivityMonitor";
import { MainWalletCurrencySwift } from "./MainWalletCurrencySwift";
import { QuickCryptoPulse } from "./QuickCryptoPulse";

const INITIAL_WALLET_BALANCE_USD = 320299;
const initialCards: PaymentCard[] = [
  {
    id: "primary-card",
    network: "VISA",
    holder: "Emma Richardson",
    number: "•••• 5898",
    color: "from-[#1a1a2e] via-[#273056] to-[#3DAB6B]",
  },
  {
    id: "mastercard-noah",
    network: "Mastercard",
    holder: "Noah Bennett",
    number: "•••• 2047",
    color: "from-[#3DAB6B] via-[#47bc76] to-[#151827]",
  },
  {
    id: "visa-ava",
    network: "VISA",
    holder: "Ava Thompson",
    number: "•••• 9012",
    color: "from-[#e85d6f] via-[#7C3AED] to-[#1a1a2e]",
  },
];

export function DashboardOverview() {
  const [walletBalanceUsd, setWalletBalanceUsd] = useState(
    INITIAL_WALLET_BALANCE_USD,
  );
  const [activeModal, setActiveModal] = useState<DashboardModalView>(null);
  const [activeCurrency, setActiveCurrency] =
    useState<DashboardCurrency>("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [cards, setCards] = useState<PaymentCard[]>(initialCards);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>(() =>
    createMockTransactions(),
  );

  function handleBillPayment(amount: number) {
    setWalletBalanceUsd((current) => Math.max(0, current - amount));
  }

  const handleCurrencyChange = useCallback(
    (currency: DashboardCurrency, nextExchangeRate: number) => {
      setActiveCurrency(currency);
      setExchangeRate(nextExchangeRate);
    },
    [],
  );

  function handleLinkCard(holder: string, number: string) {
    setCards((currentCards) =>
      currentCards.map((card, index) =>
        index === 0
          ? {
              ...card,
              holder,
              number,
            }
          : card,
      ),
    );
  }

  function handleWithdraw(amount: number, bankName: string) {
    const amountUsd = amount / (exchangeRate > 0 ? exchangeRate : 1);

    setWalletBalanceUsd((current) => Math.max(0, current - amountUsd));
    setTransactions((currentTransactions) => [
      {
        id: `withdrawal-${Date.now()}`,
        merchant: `Bank Withdrawal (${bankName})`,
        category: "Transfer",
        timestamp: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
        amount: amountUsd,
        direction: "debit",
        iconLabel: "BW",
        iconClassName: "bg-[#e85d6f] text-white",
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
          new Date(),
        ),
      },
      ...currentTransactions,
    ]);
  }

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#1a1a2e]">
      <motion.div
        className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-8 md:px-8 lg:px-10 lg:py-12"
        variants={dashboardContainerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header
          variants={dashboardItemVariants}
          className="relative overflow-hidden rounded-[2rem] bg-white px-6 py-8 shadow-[0_24px_80px_-45px_rgba(26,26,46,0.45)] md:px-8 lg:px-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#3DAB6B]/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-28 h-40 w-40 rounded-full bg-[#e85d6f]/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <SectionEyebrow>Public preview mode</SectionEyebrow>
              <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-[#1a1a2e] md:text-5xl">
                Dashboard Overview
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                Monitor wallet balances, live market pulses, instant actions,
                and recent financial activity from one polished SaaSto control
                center.
              </p>
            </div>
            <div className="grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#3DAB6B] p-4 text-white shadow-[0_16px_42px_-18px_rgba(61,171,107,0.65)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Status
                </p>
                <p className="mt-2 text-2xl font-black">Open</p>
              </div>
              <div className="rounded-2xl bg-[#1a1a2e] p-4 text-white shadow-[0_16px_42px_-18px_rgba(26,26,46,0.65)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Blocks
                </p>
                <p className="mt-2 text-2xl font-black">4 Live</p>
              </div>
            </div>
          </div>
        </motion.header>

        <MotionSection>
          <MainWalletCurrencySwift
            walletBalanceUsd={walletBalanceUsd}
            cards={cards}
            onCurrencyChange={handleCurrencyChange}
          />
        </MotionSection>

        <MotionSection>
          <QuickCryptoPulse />
        </MotionSection>

        <MotionSection>
          <InstantActionHub
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            onBillPayment={handleBillPayment}
            onLinkCard={handleLinkCard}
            onWithdraw={handleWithdraw}
            activeCurrency={activeCurrency}
          />
        </MotionSection>

        <MotionSection>
          <LiveActivityMonitor
            transactions={transactions}
            activeCurrency={activeCurrency}
            exchangeRate={exchangeRate}
          />
        </MotionSection>
      </motion.div>
    </main>
  );
}
