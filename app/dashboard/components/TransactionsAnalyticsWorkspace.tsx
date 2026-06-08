"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DashboardCurrency, DashboardTransaction } from "../lib/dashboardTypes";
import {
  fetchCurrencyRates,
  formatCurrencyValue,
  formatSignedCurrencyValue,
} from "../lib/exchangeRates";
import { createMockTransactions } from "../lib/mockTransactions";
import {
  MotionCard,
  SectionEyebrow,
  dashboardContainerVariants,
  dashboardItemVariants,
} from "./DashboardPrimitives";
import { PremiumDropdown } from "./PremiumDropdown";

type TransactionFilter = "all" | "income" | "expense";
type ExportStatus = "idle" | "generating" | "success";

type MerchantProfile = {
  id: string;
  aliases: string[];
  displayName: string;
  tag: string;
  initial: string;
  brandClassName: string;
  accentColor: string;
  subscription: boolean;
  nextBillingDate?: string;
};

type CategorySlice = {
  category: string;
  amountUsd: number;
  color: string;
  percentage: number;
};

const ROWS_PER_PAGE = 6;

const filterOptions: Array<{ id: TransactionFilter; label: string }> = [
  { id: "all", label: "All Transactions" },
  { id: "income", label: "Incomes" },
  { id: "expense", label: "Expenses" },
];

const currencies: DashboardCurrency[] = ["USD", "EUR", "RSD"];

const categoryColors = [
  "#3DAB6B",
  "#e85d6f",
  "#1a1a2e",
  "#F59E0B",
  "#7C3AED",
  "#0EA5E9",
  "#64748B",
];

const merchantProfiles: MerchantProfile[] = [
  {
    id: "netflix",
    aliases: ["netflix", "nflx", "streaming"],
    displayName: "Netflix",
    tag: "Streaming Service",
    initial: "N",
    brandClassName: "bg-black text-red-500",
    accentColor: "#E50914",
    subscription: true,
    nextBillingDate: "Jun 24, 2026",
  },
  {
    id: "amazon",
    aliases: ["amazon", "marketplace", "shopping"],
    displayName: "Amazon",
    tag: "Marketplace",
    initial: "Am",
    brandClassName: "bg-[#FF9900] text-white",
    accentColor: "#FF9900",
    subscription: false,
  },
  {
    id: "spotify",
    aliases: ["spotify", "music", "audio"],
    displayName: "Spotify",
    tag: "Music Subscription",
    initial: "S",
    brandClassName: "bg-[#1DB954] text-white",
    accentColor: "#1DB954",
    subscription: true,
    nextBillingDate: "Jul 2, 2026",
  },
  {
    id: "apple",
    aliases: ["apple", "icloud", "devices"],
    displayName: "Apple",
    tag: "Device Ecosystem",
    initial: "A",
    brandClassName: "bg-neutral-900 text-white",
    accentColor: "#111827",
    subscription: false,
  },
  {
    id: "uber",
    aliases: ["uber", "rides", "transport", "mobility"],
    displayName: "Uber",
    tag: "Mobility Platform",
    initial: "U",
    brandClassName: "bg-neutral-800 text-white",
    accentColor: "#111827",
    subscription: false,
  },
  {
    id: "airbnb",
    aliases: ["airbnb", "travel", "booking", "stays"],
    displayName: "Airbnb",
    tag: "Travel Booking",
    initial: "Ab",
    brandClassName: "bg-[#FF5A5F] text-white",
    accentColor: "#FF5A5F",
    subscription: false,
  },
];

const supplementalTransactions: DashboardTransaction[] = [
  {
    id: "subscription-netflix-premium",
    merchant: "Netflix",
    category: "Subscriptions",
    timestamp: "Jun 6, 9:12 AM",
    amount: 19.99,
    direction: "debit",
    iconLabel: "N",
    iconClassName: "bg-black text-red-500",
    month: "Jun",
  },
  {
    id: "subscription-spotify-family",
    merchant: "Spotify",
    category: "Subscriptions",
    timestamp: "Jun 5, 8:30 AM",
    amount: 16.99,
    direction: "debit",
    iconLabel: "S",
    iconClassName: "bg-[#1DB954] text-white",
    month: "Jun",
  },
  {
    id: "amazon-office-order",
    merchant: "Amazon",
    category: "Shopping",
    timestamp: "Jun 4, 2:18 PM",
    amount: 286.74,
    direction: "debit",
    iconLabel: "Am",
    iconClassName: "bg-[#FF9900] text-white",
    month: "Jun",
  },
  {
    id: "uber-client-ride",
    merchant: "Uber",
    category: "Transport",
    timestamp: "Jun 3, 7:42 PM",
    amount: 42.18,
    direction: "debit",
    iconLabel: "U",
    iconClassName: "bg-neutral-800 text-white",
    month: "Jun",
  },
  {
    id: "apple-cloud-renewal",
    merchant: "Apple",
    category: "Subscriptions",
    timestamp: "Jun 2, 11:05 AM",
    amount: 9.99,
    direction: "debit",
    iconLabel: "A",
    iconClassName: "bg-neutral-900 text-white",
    month: "Jun",
  },
  {
    id: "airbnb-team-offsite",
    merchant: "Airbnb",
    category: "Travel",
    timestamp: "May 30, 10:14 AM",
    amount: 642.6,
    direction: "debit",
    iconLabel: "Ab",
    iconClassName: "bg-[#FF5A5F] text-white",
    month: "May",
  },
  {
    id: "utility-grid-energy",
    merchant: "Grid Energy",
    category: "Utilities",
    timestamp: "May 28, 4:45 PM",
    amount: 219.4,
    direction: "debit",
    iconLabel: "GE",
    iconClassName: "bg-[#0EA5E9] text-white",
    month: "May",
  },
  {
    id: "client-wire-income",
    merchant: "Northstar Client",
    category: "Income",
    timestamp: "May 27, 1:00 PM",
    amount: 7400,
    direction: "credit",
    iconLabel: "NC",
    iconClassName: "bg-[#3DAB6B] text-white",
    month: "May",
  },
];

function createTransactionHistory() {
  return [...supplementalTransactions, ...createMockTransactions()];
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getTransactionStatus(transaction: DashboardTransaction) {
  if (transaction.direction === "credit") return "Income";
  return merchantProfiles.some(
    (profile) =>
      profile.subscription &&
      normalize(profile.displayName) === normalize(transaction.merchant),
  )
    ? "Recurring"
    : "Completed";
}

function getActiveMerchantProfile(searchTerm: string) {
  const query = normalize(searchTerm);
  if (!query) return null;

  return (
    merchantProfiles.find((profile) =>
      profile.aliases.some((alias) => alias === query),
    ) ??
    merchantProfiles.find((profile) =>
      profile.aliases.some((alias) => alias.includes(query) || query.includes(alias)),
    ) ??
    null
  );
}

function formatTransactionAmount(
  transaction: DashboardTransaction,
  activeCurrency: DashboardCurrency,
  exchangeRate: number,
) {
  return formatSignedCurrencyValue(
    transaction.amount * exchangeRate,
    activeCurrency,
    transaction.direction === "credit" ? "+" : "-",
  );
}

function filterTransactions(
  transactions: DashboardTransaction[],
  searchTerm: string,
  activeFilter: TransactionFilter,
) {
  const query = normalize(searchTerm);

  return transactions.filter((transaction) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "income" && transaction.direction === "credit") ||
      (activeFilter === "expense" && transaction.direction === "debit");

    if (!matchesFilter) return false;
    if (!query) return true;

    const searchable = [
      transaction.merchant,
      transaction.category,
      transaction.timestamp,
      transaction.direction,
      getTransactionStatus(transaction),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

function buildCategoryBreakdown(transactions: DashboardTransaction[]) {
  const debitTransactions = transactions.filter(
    (transaction) => transaction.direction === "debit",
  );
  const totalDebitUsd = debitTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  const categoryTotals = debitTransactions.reduce<Record<string, number>>(
    (totals, transaction) => ({
      ...totals,
      [transaction.category]: (totals[transaction.category] ?? 0) + transaction.amount,
    }),
    {},
  );

  return Object.entries(categoryTotals)
    .sort(([, leftAmount], [, rightAmount]) => rightAmount - leftAmount)
    .map(([category, amountUsd], index) => ({
      category,
      amountUsd,
      color: categoryColors[index % categoryColors.length],
      percentage: totalDebitUsd > 0 ? (amountUsd / totalDebitUsd) * 100 : 0,
    }));
}

function findMerchantTransactions(
  transactions: DashboardTransaction[],
  profile: MerchantProfile | null,
) {
  if (!profile) return [];

  return transactions.filter((transaction) => {
    const merchant = normalize(transaction.merchant);
    return (
      merchant === normalize(profile.displayName) ||
      profile.aliases.some((alias) => merchant.includes(alias))
    );
  });
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

function DocumentIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" fill="none" aria-hidden>
      <rect
        x="24"
        y="14"
        width="72"
        height="92"
        rx="18"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="3"
      />
      <path d="M72 14v22h24" fill="#F9FAFB" />
      <path d="M72 14v22h24" stroke="#E5E7EB" strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 45h32M40 57h42M40 69h28" stroke="#3DAB6B" strokeWidth="5" strokeLinecap="round" />
      <rect x="40" y="82" width="14" height="10" rx="3" fill="#3DAB6B" opacity="0.9" />
      <rect x="58" y="76" width="14" height="16" rx="3" fill="#3DAB6B" opacity="0.55" />
      <rect x="76" y="64" width="14" height="28" rx="3" fill="#1a1a2e" opacity="0.9" />
    </svg>
  );
}

export function TransactionsAnalyticsWorkspace() {
  const [transactions] = useState<DashboardTransaction[]>(() =>
    createTransactionHistory(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>("all");
  const [activeCurrency, setActiveCurrency] = useState<DashboardCurrency>("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [ratesStatus, setRatesStatus] = useState("Live conversion ready");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadRates() {
      setRatesStatus("Refreshing rates");

      try {
        const nextRates = await fetchCurrencyRates();
        if (!mounted) return;

        setExchangeRate(nextRates[activeCurrency] ?? 1);
        setRatesStatus("Live conversion ready");
      } catch {
        if (!mounted) return;

        setExchangeRate(1);
        setRatesStatus("USD fallback active");
      }
    }

    loadRates();

    return () => {
      mounted = false;
    };
  }, [activeCurrency]);

  useEffect(() => {
    if (!isExportModalOpen || exportStatus !== "generating") return;

    const interval = window.setInterval(() => {
      setExportProgress((current) => {
        const nextProgress = Math.min(100, current + 8 + Math.round(Math.random() * 12));
        if (nextProgress >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => setExportStatus("success"), 260);
        }

        return nextProgress;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [exportStatus, isExportModalOpen]);

  const activeMerchantProfile = useMemo(
    () => getActiveMerchantProfile(searchTerm),
    [searchTerm],
  );
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, searchTerm, activeFilter),
    [activeFilter, searchTerm, transactions],
  );
  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(transactions),
    [transactions],
  );
  const merchantTransactions = useMemo(
    () => findMerchantTransactions(transactions, activeMerchantProfile),
    [activeMerchantProfile, transactions],
  );
  const totalDebitUsd = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.direction === "debit")
        .reduce((total, transaction) => total + transaction.amount, 0),
    [transactions],
  );
  const totalCreditUsd = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.direction === "credit")
        .reduce((total, transaction) => total + transaction.amount, 0),
    [transactions],
  );

  const handleExport = useCallback(() => {
    setExportProgress(0);
    setIsExportModalOpen(true);
    setExportStatus("generating");
  }, []);

  const closeExportModal = useCallback(() => {
    setIsExportModalOpen(false);
    window.setTimeout(() => {
      setExportStatus("idle");
      setExportProgress(0);
    }, 220);
  }, []);

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#1a1a2e]">
      <motion.div
        className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-8 md:px-8 lg:px-10 lg:py-12"
        variants={dashboardContainerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader
          activeCurrency={activeCurrency}
          exchangeRate={exchangeRate}
          ratesStatus={ratesStatus}
          totalCreditUsd={totalCreditUsd}
          totalDebitUsd={totalDebitUsd}
          onCurrencyChange={setActiveCurrency}
        />

        <TransactionControlPanel
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            setCurrentPage(1);
          }}
        />

        <ReactiveMerchantAnalytics
          activeCurrency={activeCurrency}
          exchangeRate={exchangeRate}
          activeMerchantProfile={activeMerchantProfile}
          categoryBreakdown={categoryBreakdown}
          merchantTransactions={merchantTransactions}
          totalDebitUsd={totalDebitUsd}
        />

        <TransactionsLedger
          transactions={filteredTransactions}
          activeCurrency={activeCurrency}
          exchangeRate={exchangeRate}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onResetFilters={() => {
            setSearchTerm("");
            setActiveFilter("all");
          }}
          searchTerm={searchTerm}
          activeFilter={activeFilter}
        />

        <FinancialStatementExportCard
          onExport={handleExport}
          filteredCount={filteredTransactions.length}
        />
      </motion.div>

      <ExportProgressModal
        open={isExportModalOpen}
        status={exportStatus}
        progress={exportProgress}
        onClose={closeExportModal}
      />
    </main>
  );
}

function PageHeader({
  activeCurrency,
  exchangeRate,
  ratesStatus,
  totalCreditUsd,
  totalDebitUsd,
  onCurrencyChange,
}: {
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
  ratesStatus: string;
  totalCreditUsd: number;
  totalDebitUsd: number;
  onCurrencyChange: (currency: DashboardCurrency) => void;
}) {
  return (
    <motion.header
      variants={dashboardItemVariants}
      className="relative overflow-visible rounded-[2rem] bg-white px-6 py-8 shadow-[0_24px_80px_-45px_rgba(26,26,46,0.45)] md:px-8 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#3DAB6B]/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-40 w-40 rounded-full bg-[#e85d6f]/10 blur-3xl" />
      </div>
      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <SectionEyebrow>Transaction Intelligence</SectionEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-[#1a1a2e] md:text-5xl">
            Transaction History & Analytics
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Search every ledger movement, spotlight merchant behavior, and export a
            polished financial statement from one responsive SaaSto analytics workspace.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
          <div className="rounded-2xl bg-[#3DAB6B] p-4 text-white shadow-[0_16px_42px_-18px_rgba(61,171,107,0.65)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Net Flow
            </p>
            <p className="mt-2 text-2xl font-black">
              {formatCurrencyValue((totalCreditUsd - totalDebitUsd) * exchangeRate, activeCurrency)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#1a1a2e] p-4 text-white shadow-[0_16px_42px_-18px_rgba(26,26,46,0.65)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              Currency
            </p>
            <PremiumDropdown
              value={activeCurrency}
              options={currencies}
              onChange={onCurrencyChange}
              ariaLabel="Select transaction currency"
              className="mt-2 w-full"
              triggerClassName="w-full border-white/15 bg-white/10 text-white font-black hover:bg-white/15 hover:border-white/25"
              menuClassName="left-0 right-auto z-[100]"
            />
            <p className="mt-2 text-xs font-medium text-white/60">{ratesStatus}</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function TransactionControlPanel({
  searchTerm,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: {
  searchTerm: string;
  activeFilter: TransactionFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: TransactionFilter) => void;
}) {
  return (
    <MotionCard className="p-4 transition-shadow duration-300 hover:shadow-[0_22px_60px_-34px_rgba(26,26,46,0.5),0_6px_20px_rgba(26,26,46,0.08)] sm:p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="group relative block min-w-0 flex-1 lg:max-w-xl">
          <span className="sr-only">Search transactions</span>
          <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-neutral-400 transition-colors duration-200 group-focus-within:text-[#3DAB6B]">
            <motion.span
              className="flex"
              animate={searchTerm ? { scale: 1.06 } : { scale: 1 }}
            >
              <SearchIcon className="h-5 w-5" />
            </motion.span>
          </span>
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transactions, merchants, categories..."
            className="h-14 w-full rounded-2xl border border-neutral-200 bg-white pl-12 pr-12 text-sm font-semibold text-[#1a1a2e] shadow-sm outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-[#3DAB6B] focus:bg-[#3DAB6B]/[0.03] focus:ring-4 focus:ring-emerald-50/50"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-sm font-black text-neutral-500 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#3DAB6B]/35"
              aria-label="Clear search"
            >
              x
            </button>
          ) : null}
        </label>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap lg:justify-end lg:pb-0">
          {filterOptions.map((option) => {
            const active = option.id === activeFilter;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => onFilterChange(option.id)}
                whileTap={{ scale: 0.95 }}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full border px-5 py-3 text-sm font-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3DAB6B]/35 ${
                  active
                    ? "border-[#3DAB6B] bg-[#3DAB6B] text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="active-transaction-filter"
                    className="absolute inset-0 rounded-full bg-[#3DAB6B]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </MotionCard>
  );
}

function ReactiveMerchantAnalytics({
  activeCurrency,
  exchangeRate,
  activeMerchantProfile,
  categoryBreakdown,
  merchantTransactions,
  totalDebitUsd,
}: {
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
  activeMerchantProfile: MerchantProfile | null;
  categoryBreakdown: CategorySlice[];
  merchantTransactions: DashboardTransaction[];
  totalDebitUsd: number;
}) {
  const topCategory = categoryBreakdown[0];
  const averageDebitUsd =
    categoryBreakdown.length > 0
      ? totalDebitUsd /
        categoryBreakdown.reduce((count, slice) => count + (slice.amountUsd > 0 ? 1 : 0), 0)
      : 0;
  const subscriptionCount = merchantProfiles.filter((profile) => profile.subscription).length;
  const merchantSpentUsd = merchantTransactions
    .filter((transaction) => transaction.direction === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const budgetFootprint = totalDebitUsd > 0 ? Math.min(100, (merchantSpentUsd / totalDebitUsd) * 100) : 0;

  return (
    <MotionCard className="overflow-hidden p-5 md:p-6 lg:p-8">
      <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-neutral-500">Merchant Analytics</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
            {activeMerchantProfile
              ? `${activeMerchantProfile.displayName} spending profile`
              : "Monthly expense breakdown"}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-neutral-500">
          {activeMerchantProfile
            ? "A focused merchant spotlight with subscription context, budget footprint, and converted spend totals."
            : "A global category wheel that summarizes your monthly outflow and highlights the largest spend drivers."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <AnimatePresence mode="wait">
          {activeMerchantProfile ? (
            <MerchantSpotlight
              key={activeMerchantProfile.id}
              profile={activeMerchantProfile}
              merchantSpentUsd={merchantSpentUsd}
              budgetFootprint={budgetFootprint}
              transactionCount={merchantTransactions.length}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          ) : (
            <GlobalDonutAnalytics
              key="global"
              slices={categoryBreakdown}
              totalDebitUsd={totalDebitUsd}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          )}
        </AnimatePresence>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Total Monthly Outflow"
            value={formatCurrencyValue(totalDebitUsd * exchangeRate, activeCurrency)}
            detail="Across all debit transactions"
          />
          <MetricCard
            label="Top Category"
            value={topCategory?.category ?? "No data"}
            detail={
              topCategory
                ? `${topCategory.percentage.toFixed(1)}% of monthly outflow`
                : "No expense categories yet"
            }
          />
          <MetricCard
            label="Average Category Load"
            value={formatCurrencyValue(averageDebitUsd * exchangeRate, activeCurrency)}
            detail="Mean spend across active categories"
          />
          <MetricCard
            label="Recurring Services"
            value={`${subscriptionCount} Active`}
            detail="Subscription profiles monitored"
          />
        </div>
      </div>
    </MotionCard>
  );
}

function GlobalDonutAnalytics({
  slices,
  totalDebitUsd,
  activeCurrency,
  exchangeRate,
}: {
  slices: CategorySlice[];
  totalDebitUsd: number;
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
}) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const renderedSlices = slices.map((slice, index) => {
    const previousPercentage = slices
      .slice(0, index)
      .reduce((total, previousSlice) => total + previousSlice.percentage, 0);
    const dash = (slice.percentage / 100) * circumference;

    return {
      ...slice,
      dash,
      gap: circumference - dash,
      offset: -(previousPercentage / 100) * circumference,
    };
  });

  return (
    <motion.div
      layout
      className="rounded-[1.75rem] bg-[#f9fafb] p-5 md:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.32 }}
    >
      <div className="grid items-center gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="relative mx-auto h-[260px] w-[260px]">
          <svg
            viewBox="0 0 220 220"
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`Monthly expense split totaling ${formatCurrencyValue(
              totalDebitUsd * exchangeRate,
              activeCurrency,
            )}`}
          >
            <circle cx="110" cy="110" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="26" />
            {renderedSlices.map((slice) => (
              <motion.circle
                key={slice.category}
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="26"
                strokeLinecap="round"
                strokeDasharray={`${slice.dash} ${slice.gap}`}
                strokeDashoffset={slice.offset}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
          </svg>
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
              Outflow
            </p>
            <p className="mt-2 text-2xl font-black text-[#1a1a2e]">
              {formatCurrencyValue(totalDebitUsd * exchangeRate, activeCurrency)}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {slices.slice(0, 6).map((slice) => (
            <div
              key={slice.category}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#1a1a2e]">
                    {slice.category}
                  </p>
                  <p className="text-xs font-medium text-neutral-400">
                    {slice.percentage.toFixed(1)}% of total
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-black text-[#1a1a2e]">
                {formatCurrencyValue(slice.amountUsd * exchangeRate, activeCurrency)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MerchantSpotlight({
  profile,
  merchantSpentUsd,
  budgetFootprint,
  transactionCount,
  activeCurrency,
  exchangeRate,
}: {
  profile: MerchantProfile;
  merchantSpentUsd: number;
  budgetFootprint: number;
  transactionCount: number;
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
}) {
  return (
    <motion.div
      layout
      className="rounded-[1.75rem] bg-[#f9fafb] p-5 md:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.32 }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <motion.div
          className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full text-4xl font-black shadow-[0_22px_50px_-22px_rgba(26,26,46,0.55)] ${profile.brandClassName}`}
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {profile.initial}
        </motion.div>
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-neutral-400">
            Brand Identity Cluster
          </p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-[#1a1a2e]">
            {profile.displayName}
          </h3>
          <p className="mt-1 text-sm font-semibold text-neutral-500">{profile.tag}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
            Aggregated Spent
          </p>
          <motion.p
            key={`${profile.id}-${activeCurrency}-${merchantSpentUsd}`}
            className="mt-3 text-4xl font-black tracking-tight text-[#1a1a2e]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formatCurrencyValue(merchantSpentUsd * exchangeRate, activeCurrency)}
          </motion.p>
          <p className="mt-2 text-sm font-medium text-neutral-500">
            Calculated from {transactionCount} matching ledger entries.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
            Operational Status
          </p>
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
              profile.subscription
                ? "bg-[#3DAB6B]/10 text-[#3DAB6B]"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {profile.subscription ? (
              <span className="relative flex h-2.5 w-2.5">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#3DAB6B] opacity-60"
                  animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3DAB6B]" />
              </span>
            ) : null}
            {profile.subscription ? "Subscription Active" : "Discretionary Spending"}
          </div>
          <p className="mt-3 text-sm font-medium text-neutral-500">
            {profile.subscription
              ? `Next billing date: ${profile.nextBillingDate}`
              : "Transactional vendor with variable monthly cadence."}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
              Budget Footprint
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-500">
              Share of total monthly outflow consumed by this merchant.
            </p>
          </div>
          <span className="text-xl font-black text-[#1a1a2e]">
            {budgetFootprint.toFixed(1)}%
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: profile.accentColor }}
            initial={{ width: 0 }}
            animate={{ width: `${budgetFootprint}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#f9fafb] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black tracking-tight text-[#1a1a2e]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">{detail}</p>
    </div>
  );
}

function TransactionsLedger({
  transactions,
  activeCurrency,
  exchangeRate,
  currentPage,
  onPageChange,
  onResetFilters,
  searchTerm,
  activeFilter,
}: {
  transactions: DashboardTransaction[];
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  searchTerm: string;
  activeFilter: TransactionFilter;
}) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageTransactions = transactions.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [currentPage, onPageChange, totalPages]);

  return (
    <MotionCard className="overflow-hidden p-0">
      <div className="flex flex-col justify-between gap-3 p-5 md:flex-row md:items-end md:p-6 lg:p-8">
        <div>
          <p className="text-sm font-semibold text-neutral-500">Master Ledger</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
            Transaction history
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-neutral-500">
          Showing {transactions.length} records for the current{" "}
          {activeFilter === "all" ? "ledger" : activeFilter} view
          {searchTerm ? ` matching "${searchTerm}"` : ""}.
        </p>
      </div>

      <div className="mx-5 overflow-hidden rounded-3xl border border-neutral-100 md:mx-6 lg:mx-8">
        <div className="hidden grid-cols-[0.9fr_1.4fr_0.95fr_1fr_0.85fr_0.9fr] bg-[#f9fafb] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-neutral-400 lg:grid">
          <span>Icon</span>
          <span>Merchant</span>
          <span>Category</span>
          <span>Timestamp</span>
          <span>Status</span>
          <span className="text-right">Amount</span>
        </div>

        {pageTransactions.length > 0 ? (
          <motion.div
            key={`${searchTerm}-${activeFilter}-${safePage}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.055 } },
            }}
          >
            {pageTransactions.map((transaction) => (
              <LedgerRow
                key={transaction.id}
                transaction={transaction}
                activeCurrency={activeCurrency}
                exchangeRate={exchangeRate}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3DAB6B]/10 text-[#3DAB6B]">
              <SearchIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-black text-[#1a1a2e]">
              No transactions match your current filters.
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
              Clear the search and return to all transactions to restore the complete
              ledger view.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 rounded-full bg-[#3DAB6B] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3DAB6B]/35"
            >
              Reset ledger
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6 lg:p-8">
        <p className="text-sm font-semibold text-neutral-500">
          Page {safePage} of {totalPages}
        </p>
        <div className="flex gap-4 sm:hidden">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-black text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="flex-1 rounded-2xl bg-[#3DAB6B] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#34985d] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
          >
            Next
          </motion.button>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-black text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </motion.button>
          <span className="rounded-full bg-[#3DAB6B] px-4 py-2 text-sm font-black text-white">
            {safePage}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-black text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </motion.button>
        </div>
      </div>
    </MotionCard>
  );
}

function LedgerRow({
  transaction,
  activeCurrency,
  exchangeRate,
}: {
  transaction: DashboardTransaction;
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
}) {
  const positive = transaction.direction === "credit";
  const status = getTransactionStatus(transaction);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0 },
      }}
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-t border-neutral-100 px-4 py-4 transition duration-200 hover:bg-[#f9fafb] sm:px-5 lg:grid-cols-[0.9fr_1.4fr_0.95fr_1fr_0.85fr_0.9fr] lg:hover:scale-[1.005]"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${transaction.iconClassName}`}
      >
        {transaction.iconLabel}
      </div>

      <div className="min-w-0 -ml-1 lg:ml-0">
        <p className="truncate text-sm font-black text-[#1a1a2e]">{transaction.merchant}</p>
        <p className="mt-1 truncate text-xs font-medium text-neutral-400 lg:hidden">
          {transaction.category} · {transaction.timestamp}
        </p>
      </div>

      <span className="hidden w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500 lg:inline-flex">
        {transaction.category}
      </span>
      <span className="hidden text-sm font-medium text-neutral-500 lg:block">
        {transaction.timestamp}
      </span>
      <span
        className={`hidden w-fit rounded-full px-3 py-1 text-xs font-black lg:inline-flex ${
          status === "Recurring"
            ? "bg-[#3DAB6B]/10 text-[#3DAB6B]"
            : status === "Income"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-600"
        }`}
      >
        {status}
      </span>

      <div className="text-right lg:contents">
        <span
          className={`block text-sm font-black lg:text-right ${
            positive ? "text-[#3DAB6B]" : "text-[#e85d6f]"
          }`}
        >
          {formatTransactionAmount(transaction, activeCurrency, exchangeRate)}
        </span>
        <span
          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black lg:hidden ${
            status === "Recurring"
              ? "bg-[#3DAB6B]/10 text-[#3DAB6B]"
              : status === "Income"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>
      </div>
    </motion.div>
  );
}

function FinancialStatementExportCard({
  onExport,
  filteredCount,
}: {
  onExport: () => void;
  filteredCount: number;
}) {
  return (
    <MotionCard className="overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-34px_rgba(26,26,46,0.5),0_6px_20px_rgba(26,26,46,0.08)] md:p-6 lg:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] bg-[#3DAB6B]/10">
            <DocumentIllustration />
          </div>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-neutral-500">
              Download Financial Statement
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
              Export your financial ledger
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500 md:text-base">
              Generate a clean statement snapshot with the current filtered ledger,
              converted amounts, and merchant analytics context across {filteredCount} records.
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onExport}
          className="w-full rounded-2xl bg-[#3DAB6B] px-6 py-4 text-sm font-black text-white shadow-[0_16px_38px_-18px_rgba(61,171,107,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-18px_rgba(61,171,107,0.85)] focus:outline-none focus:ring-2 focus:ring-[#3DAB6B]/35 md:w-auto"
        >
          Export Financial Ledger
        </motion.button>
      </div>
    </MotionCard>
  );
}

function ExportProgressModal({
  open,
  status,
  progress,
  onClose,
}: {
  open: boolean;
  status: ExportStatus;
  progress: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
          onMouseDown={status === "success" ? onClose : undefined}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#3DAB6B] text-white shadow-[0_18px_42px_-18px_rgba(61,171,107,0.85)]">
                    <CheckIcon className="h-10 w-10" />
                  </div>
                  <h2
                    id="export-modal-title"
                    className="mt-6 text-2xl font-black text-[#1a1a2e]"
                  >
                    Financial statement exported successfully!
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                    Your simulated ledger package is ready and the export pipeline has
                    completed cleanly.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl bg-[#3DAB6B] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3DAB6B]/35"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <h2
                    id="export-modal-title"
                    className="text-2xl font-black text-[#1a1a2e]"
                  >
                    Generating financial statement
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                    Compiling filtered transactions, converted values, and merchant
                    analytics into a polished export.
                  </p>
                  <div
                    className="mt-7 h-3 overflow-hidden rounded-full bg-neutral-100"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <motion.div
                      className="h-full rounded-full bg-[#3DAB6B]"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.18 }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-black text-[#3DAB6B]">
                    {progress}% complete
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
