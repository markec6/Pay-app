"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  fetchCurrencyRates,
  formatCurrencyValue,
} from "../lib/exchangeRates";
import type {
  CurrencyRates,
  DashboardCurrency,
  PaymentCard,
} from "../lib/dashboardTypes";
import { ArrowIcon, MotionCard } from "./DashboardPrimitives";

const currencies: DashboardCurrency[] = ["USD", "EUR", "RSD"];

export function MainWalletCurrencySwift({
  walletBalanceUsd,
  cards,
  onCurrencyChange,
}: {
  walletBalanceUsd: number;
  cards: PaymentCard[];
  onCurrencyChange: (currency: DashboardCurrency, exchangeRate: number) => void;
}) {
  const [activeCurrency, setActiveCurrency] =
    useState<DashboardCurrency>("USD");
  const [rates, setRates] = useState<CurrencyRates>({ USD: 1 });
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRates() {
      setIsRateLoading(true);
      setRateError(null);

      try {
        const nextRates = await fetchCurrencyRates();
        if (mounted) setRates(nextRates);
      } catch (error) {
        if (mounted) {
          setRateError(
            error instanceof Error
              ? error.message
              : "Unable to load exchange rates.",
          );
        }
      } finally {
        if (mounted) setIsRateLoading(false);
      }
    }

    loadRates();

    return () => {
      mounted = false;
    };
  }, []);

  const convertedBalance = useMemo(() => {
    const multiplier = rates[activeCurrency] ?? 1;
    return walletBalanceUsd * multiplier;
  }, [activeCurrency, rates, walletBalanceUsd]);

  useEffect(() => {
    onCurrencyChange(activeCurrency, rates[activeCurrency] ?? 1);
  }, [activeCurrency, onCurrencyChange, rates]);

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <MotionCard className="overflow-hidden p-6 lg:col-span-1">
        <div className="relative">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#3DAB6B]/20 blur-3xl" />
          <div className="relative">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-500">
                  Main Wallet
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
                  Currency Swift
                </h2>
              </div>
              <select
                value={activeCurrency}
                onChange={(event) =>
                  setActiveCurrency(event.target.value as DashboardCurrency)
                }
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-[#1a1a2e] shadow-sm outline-none transition focus:border-[#3DAB6B]"
                aria-label="Select wallet currency"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <motion.p
              key={`${activeCurrency}-${convertedBalance}`}
              className="text-4xl font-extrabold tracking-tight text-[#1a1a2e] md:text-5xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {formatCurrencyValue(convertedBalance, activeCurrency)}
            </motion.p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#3DAB6B]/10 px-3 py-1 text-xs font-bold text-[#3DAB6B]">
                <ArrowIcon direction="up" className="h-3.5 w-3.5" />
                12.8% available
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {isRateLoading
                  ? "Refreshing rates"
                  : rateError
                    ? "USD fallback active"
                    : "Live conversion ready"}
              </span>
            </div>

            <div className="mt-8 rounded-2xl bg-[#3DAB6B] p-4 text-white shadow-[0_18px_44px_-16px_rgba(61,171,107,0.65)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/85">
                  Monthly limit
                </span>
                <span className="text-sm font-bold">74%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  whileInView={{ width: "74%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {rateError ? (
              <p className="mt-4 text-xs leading-relaxed text-[#e85d6f]">
                {rateError}
              </p>
            ) : null}
          </div>
        </div>
      </MotionCard>

      <MotionCard className="overflow-hidden p-6 lg:col-span-2">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              Connected Cards
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
              Swipeable payment stack
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
            Preview premium cards, masked balances, and account rails in one
            smooth horizontal flow.
          </p>
        </div>

        <div className="flex snap-x gap-5 overflow-x-auto pb-3">
          {cards.map((card, index) => (
            <motion.article
              key={card.id}
              className={`relative min-h-[220px] min-w-[280px] snap-start overflow-hidden rounded-[2rem] bg-gradient-to-br ${card.color} p-6 text-white shadow-[0_24px_60px_-20px_rgba(26,26,46,0.55)] md:min-w-[340px]`}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute bottom-6 right-6 h-20 w-20 rounded-full border border-white/20" />
              <div className="relative flex h-full min-h-[172px] flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-14 rounded-xl bg-gradient-to-br from-white/80 to-white/25 shadow-inner" />
                  <span className="text-sm font-black uppercase tracking-[0.18em]">
                    {card.network}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold tracking-[0.28em]">
                    {card.number}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        Cardholder
                      </p>
                      <p className="mt-1 text-sm font-bold">{card.holder}</p>
                    </div>
                    <p className="text-sm font-bold">09/29</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </MotionCard>
    </section>
  );
}
