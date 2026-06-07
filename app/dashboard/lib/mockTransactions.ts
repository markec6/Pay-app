import { faker } from "@faker-js/faker";
import type {
  ChartPoint,
  DashboardTransaction,
  TransactionDirection,
} from "./dashboardTypes";

const merchants = [
  { name: "Netflix", category: "Streaming", icon: "N", color: "bg-black text-red-500" },
  { name: "Spotify", category: "Music", icon: "S", color: "bg-[#1DB954] text-white" },
  { name: "Dribbble", category: "Design", icon: "Dr", color: "bg-[#ea4c89] text-white" },
  { name: "Apple", category: "Devices", icon: "A", color: "bg-neutral-900 text-white" },
  { name: "Amazon", category: "Shopping", icon: "Am", color: "bg-[#FF9900] text-white" },
  { name: "Google", category: "Cloud", icon: "G", color: "bg-[#4285F4] text-white" },
  { name: "Airbnb", category: "Travel", icon: "Ab", color: "bg-[#FF5A5F] text-white" },
  { name: "Uber", category: "Transport", icon: "U", color: "bg-neutral-800 text-white" },
  { name: "Adobe", category: "Software", icon: "Ad", color: "bg-[#FA0F00] text-white" },
  { name: "Stripe", category: "Income", icon: "St", color: "bg-[#635BFF] text-white" },
] as const;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

export function createMockTransactions(): DashboardTransaction[] {
  faker.seed(320299);

  return Array.from({ length: 10 }, (_, index) => {
    const merchant = merchants[index % merchants.length];
    const direction: TransactionDirection =
      merchant.category === "Income" || faker.datatype.boolean({ probability: 0.28 })
        ? "credit"
        : "debit";

    return {
      id: faker.string.uuid(),
      merchant: merchant.name,
      category: merchant.category,
      timestamp: faker.date
        .recent({ days: 24 })
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      amount: Number(
        faker.finance.amount({
          min: direction === "credit" ? 900 : 18,
          max: direction === "credit" ? 6200 : 980,
          dec: 2,
        }),
      ),
      direction,
      iconLabel: merchant.icon,
      iconClassName: merchant.color,
      month: months[index % months.length],
    };
  });
}

export function createChartPoints(
  transactions: DashboardTransaction[],
): ChartPoint[] {
  return months.map((month, index) => {
    const monthTransactions = transactions.filter((item) => item.month === month);
    const income = monthTransactions
      .filter((item) => item.direction === "credit")
      .reduce((total, item) => total + item.amount, 3200 + index * 740);
    const expenses = monthTransactions
      .filter((item) => item.direction === "debit")
      .reduce((total, item) => total + item.amount, 1800 + index * 430);

    return {
      month,
      income: Math.round(income),
      expenses: Math.round(expenses),
    };
  });
}
