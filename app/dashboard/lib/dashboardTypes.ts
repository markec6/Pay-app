export type DashboardCurrency = "USD" | "EUR" | "RSD";

export type CurrencyRates = Partial<Record<DashboardCurrency, number>>;

export type CryptoSymbol = "bitcoin" | "ethereum";

export type CryptoPrice = {
  id: CryptoSymbol;
  label: string;
  ticker: "BTC" | "ETH";
  usd: number | null;
  usd24hChange: number | null;
};

export type TransactionDirection = "credit" | "debit";

export type DashboardTransaction = {
  id: string;
  merchant: string;
  category: string;
  timestamp: string;
  amount: number;
  direction: TransactionDirection;
  iconLabel: string;
  iconClassName: string;
  month: string;
};

export type PaymentCard = {
  id: string;
  network: "VISA" | "Mastercard";
  holder: string;
  number: string;
  color: string;
};

export type ChartPoint = {
  month: string;
  income: number;
  expenses: number;
};

export type DashboardModalView =
  | null
  | "bill-payment"
  | "withdraw"
  | "add-card"
  | "success";
