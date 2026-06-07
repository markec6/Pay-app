"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  emptyCryptoPrices,
  fetchCryptoPrices,
  formatUsdPrice,
} from "../lib/cryptoPrices";
import type { CryptoPrice } from "../lib/dashboardTypes";
import { ArrowIcon, MotionCard } from "./DashboardPrimitives";

function Sparkline({
  positive,
  className = "",
}: {
  positive: boolean;
  className?: string;
}) {
  const points = positive
    ? "2,62 26,52 48,56 70,34 92,40 116,18 138,24"
    : "2,24 26,34 48,28 70,46 92,42 116,58 138,50";

  return (
    <svg viewBox="0 0 140 72" className={className} fill="none" aria-hidden>
      <path
        d={`M${points.replaceAll(" ", " L")}`}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${points.replaceAll(" ", " L")} V72 H2 Z`}
        fill="currentColor"
        opacity="0.08"
      />
    </svg>
  );
}

function PhoneMockup({ coin }: { coin: CryptoPrice }) {
  const change = coin.usd24hChange;
  const positive = (change ?? 0) >= 0;
  const accent = positive ? "text-[#3DAB6B]" : "text-[#e85d6f]";
  const background =
    coin.ticker === "BTC"
      ? "from-[#FFF7ED] via-white to-[#ecfdf5]"
      : "from-[#F5F3FF] via-white to-[#fdf2f8]";

  return (
    <motion.article
      className="mx-auto w-full max-w-[330px] rounded-[2.5rem] border border-neutral-200 bg-[#151827] p-3 shadow-[0_26px_70px_-28px_rgba(26,26,46,0.6)]"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <div className={`rounded-[2rem] bg-gradient-to-br ${background} p-5`}>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-black text-[#1a1a2e]">9:41</span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-4 rounded-full bg-[#1a1a2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a1a2e]" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
              Live tracker
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-[#1a1a2e]">
              {coin.label}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1a2e] text-sm font-black text-white">
            {coin.ticker}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-4xl font-extrabold tracking-tight text-[#1a1a2e]">
            {formatUsdPrice(coin.usd)}
          </p>
          <div
            className={`mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm ${accent}`}
          >
            <ArrowIcon
              direction={positive ? "up" : "down"}
              className="h-3.5 w-3.5"
            />
            {change === null ? "Loading" : `${Math.abs(change).toFixed(2)}%`}
          </div>
        </div>

        <Sparkline positive={positive} className={`mt-8 h-28 w-full ${accent}`} />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-[11px] font-bold text-neutral-400">Network</p>
            <p className="mt-1 text-sm font-black text-[#1a1a2e]">Online</p>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-[11px] font-bold text-neutral-400">Signal</p>
            <p className="mt-1 text-sm font-black text-[#1a1a2e]">Stable</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function QuickCryptoPulse() {
  const [prices, setPrices] = useState<CryptoPrice[]>(emptyCryptoPrices);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("Loading");

  useEffect(() => {
    let mounted = true;

    async function loadPrices() {
      setIsCryptoLoading(true);
      setCryptoError(null);

      try {
        const nextPrices = await fetchCryptoPrices();
        if (!mounted) return;
        setPrices(nextPrices);
        setLastUpdated(
          new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date()),
        );
      } catch (error) {
        if (mounted) {
          setCryptoError(
            error instanceof Error
              ? error.message
              : "Unable to load crypto prices.",
          );
        }
      } finally {
        if (mounted) setIsCryptoLoading(false);
      }
    }

    loadPrices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MotionCard className="overflow-hidden p-6">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-neutral-500">
            Quick Crypto Pulse
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
            Smartphone market trackers
          </h2>
        </div>
        <p className="text-sm font-semibold text-neutral-500">
          {isCryptoLoading ? "Loading live feed" : `Updated ${lastUpdated}`}
        </p>
      </div>

      {cryptoError ? (
        <p className="mb-5 rounded-2xl bg-[#e85d6f]/10 px-4 py-3 text-sm font-semibold text-[#e85d6f]">
          {cryptoError}
        </p>
      ) : null}

      <motion.div
        className="grid gap-7 lg:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {prices.map((coin) => (
          <PhoneMockup key={coin.id} coin={coin} />
        ))}
      </motion.div>
    </MotionCard>
  );
}
