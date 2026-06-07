import type { CurrencyRates, DashboardCurrency } from "./dashboardTypes";

const EXCHANGE_RATE_URL = "https://v6.exchangerate-api.com/v6";

type ExchangeRatePayload = {
  result?: string;
  conversion_rates?: Record<string, number>;
};

export async function fetchCurrencyRates(): Promise<CurrencyRates> {
  const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error("Exchange rate API key is not configured.");
  }

  const response = await fetch(`${EXCHANGE_RATE_URL}/${apiKey}/latest/USD`);

  if (!response.ok) {
    throw new Error("Unable to load exchange rates.");
  }

  const data = (await response.json()) as ExchangeRatePayload;
  const rates = data.conversion_rates;

  if (data.result !== "success" || !rates) {
    throw new Error("Exchange rate response is missing conversion rates.");
  }

  return {
    USD: 1,
    EUR: rates.EUR,
    RSD: rates.RSD,
  };
}

export function formatCurrencyValue(
  amount: number,
  currency: DashboardCurrency,
): string {
  if (currency === "RSD") {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(amount)} din`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencyPrefix(currency: DashboardCurrency): string {
  if (currency === "EUR") return "€";
  if (currency === "RSD") return "din";
  return "$";
}

export function formatSignedCurrencyValue(
  amount: number,
  currency: DashboardCurrency,
  sign: "+" | "-",
): string {
  return `${sign}${formatCurrencyValue(Math.abs(amount), currency)}`;
}
