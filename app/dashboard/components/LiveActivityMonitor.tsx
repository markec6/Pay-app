"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type {
  ChartPoint,
  DashboardCurrency,
  DashboardTransaction,
} from "../lib/dashboardTypes";
import {
  formatCurrencyValue,
  formatSignedCurrencyValue,
} from "../lib/exchangeRates";
import { createChartPoints } from "../lib/mockTransactions";
import { MotionCard } from "./DashboardPrimitives";

const CHART_WIDTH = 620;
const CHART_HEIGHT = 220;

type ChartTooltip = {
  x: number;
  y: number;
  label: string;
  value: string;
};

function getChartMax(points: ChartPoint[]) {
  return Math.max(
    1,
    ...points.flatMap((point) => [point.income, point.expenses]),
  );
}

function getPointCoordinates(
  points: ChartPoint[],
  key: "income" | "expenses",
  index: number,
) {
  const maxValue = getChartMax(points);
  const xStep = CHART_WIDTH / (points.length - 1);
  const point = points[index];
  const x = index * xStep;
  const y =
    CHART_HEIGHT - (point[key] / maxValue) * (CHART_HEIGHT - 32) - 16;

  return { x, y };
}

function buildLinePath(
  points: ChartPoint[],
  key: "income" | "expenses",
) {
  return points
    .map((_, index) => {
      const { x, y } = getPointCoordinates(points, key, index);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points: ChartPoint[], key: "income" | "expenses") {
  const line = buildLinePath(points, key);
  return `${line} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`;
}

function formatAmount(
  transaction: DashboardTransaction,
  activeCurrency: DashboardCurrency,
  exchangeRate: number,
) {
  const sign = transaction.direction === "credit" ? "+" : "-";
  return formatSignedCurrencyValue(
    transaction.amount * exchangeRate,
    activeCurrency,
    sign,
  );
}

export function LiveActivityMonitor({
  transactions,
  activeCurrency,
  exchangeRate,
}: {
  transactions: DashboardTransaction[];
  activeCurrency: DashboardCurrency;
  exchangeRate: number;
}) {
  const [tooltip, setTooltip] = useState<ChartTooltip | null>(null);
  const chartPoints = useMemo(
    () => createChartPoints(transactions),
    [transactions],
  );
  const convertedChartPoints = useMemo(
    () =>
      chartPoints.map((point) => ({
        ...point,
        income: point.income * exchangeRate,
        expenses: point.expenses * exchangeRate,
      })),
    [chartPoints, exchangeRate],
  );
  const incomePath = buildLinePath(convertedChartPoints, "income");
  const expensePath = buildLinePath(convertedChartPoints, "expenses");
  const chartMax = getChartMax(convertedChartPoints);
  const yAxisLabels = [0, 1, 2, 3].map((index) => ({
    y: 40 + index * 50,
    value: chartMax - index * (chartMax / 3),
  }));

  return (
    <MotionCard className="overflow-hidden p-6">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-neutral-500">
            Live Activity Monitor
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">
            Financial grid analytics
          </h2>
        </div>
        <div className="flex gap-4 text-xs font-bold text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3DAB6B]" />
            Monthly Income
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e85d6f]" />
            Monthly Expenses
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-[#f9fafb] p-4 md:p-6">
        <svg
          viewBox="0 0 620 260"
          className="h-[260px] w-full overflow-visible"
          role="img"
          aria-label={`Monthly income and expenses chart in ${activeCurrency}`}
        >
          {yAxisLabels.map((label) => (
            <text
              key={label.y}
              x="0"
              y={label.y - 8}
              className="fill-neutral-400 text-[11px] font-bold"
            >
              {formatCurrencyValue(label.value, activeCurrency)}
            </text>
          ))}
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1="78"
              x2="620"
              y1={40 + line * 50}
              y2={40 + line * 50}
              stroke="#e5e7eb"
              strokeDasharray="8 8"
            />
          ))}
          <motion.path
            d={buildAreaPath(convertedChartPoints, "income")}
            fill="#3DAB6B"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            viewport={{ once: true }}
          />
          <motion.path
            d={buildAreaPath(convertedChartPoints, "expenses")}
            fill="#e85d6f"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.08 }}
            viewport={{ once: true }}
          />
          <motion.path
            d={incomePath}
            fill="none"
            stroke="#3DAB6B"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d={expensePath}
            fill="none"
            stroke="#e85d6f"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.12 }}
          />
          {convertedChartPoints.map((point, index) => (
            <text
              key={point.month}
              x={index * (CHART_WIDTH / (convertedChartPoints.length - 1))}
              y="252"
              textAnchor="middle"
              className="fill-neutral-400 text-[13px] font-bold"
            >
              {point.month}
            </text>
          ))}
          {convertedChartPoints.flatMap((point, index) => {
            const incomePoint = getPointCoordinates(
              convertedChartPoints,
              "income",
              index,
            );
            const expensePoint = getPointCoordinates(
              convertedChartPoints,
              "expenses",
              index,
            );

            return [
              {
                key: `${point.month}-income`,
                ...incomePoint,
                color: "#3DAB6B",
                label: `${point.month} Monthly Income`,
                value: point.income,
              },
              {
                key: `${point.month}-expenses`,
                ...expensePoint,
                color: "#e85d6f",
                label: `${point.month} Monthly Expenses`,
                value: point.expenses,
              },
            ].map((item) => (
              <circle
                key={item.key}
                cx={item.x}
                cy={item.y}
                r="8"
                fill="transparent"
                stroke={item.color}
                strokeWidth="3"
                className="cursor-pointer"
                onMouseEnter={() =>
                  setTooltip({
                    x: item.x,
                    y: item.y,
                    label: item.label,
                    value: formatCurrencyValue(item.value, activeCurrency),
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            ));
          })}
          {tooltip ? (
            <g transform={`translate(${Math.min(tooltip.x, 462)}, ${Math.max(tooltip.y - 58, 8)})`}>
              <rect
                width="150"
                height="48"
                rx="14"
                fill="white"
                filter="drop-shadow(0 10px 24px rgba(26,26,46,0.16))"
              />
              <text
                x="12"
                y="19"
                className="fill-neutral-500 text-[10px] font-bold"
              >
                {tooltip.label}
              </text>
              <text
                x="12"
                y="36"
                className="fill-[#1a1a2e] text-[13px] font-black"
              >
                {tooltip.value}
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-100">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] bg-[#f9fafb] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-neutral-400 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.7fr] md:px-5">
          <span>Merchant</span>
          <span>Category</span>
          <span className="hidden md:block">Time</span>
          <span className="text-right">Amount</span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {transactions.map((transaction) => {
            const positive = transaction.direction === "credit";

            return (
              <motion.div
                key={transaction.id}
                className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center gap-3 border-t border-neutral-100 px-4 py-4 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.7fr] md:px-5"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${transaction.iconClassName}`}
                  >
                    {transaction.iconLabel}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#1a1a2e]">
                      {transaction.merchant}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400 md:hidden">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">
                  {transaction.category}
                </span>
                <span className="hidden text-sm font-medium text-neutral-500 md:block">
                  {transaction.timestamp}
                </span>
                <span
                  className={`text-right text-sm font-black ${
                    positive ? "text-[#3DAB6B]" : "text-[#e85d6f]"
                  }`}
                >
                  {formatAmount(transaction, activeCurrency, exchangeRate)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </MotionCard>
  );
}
