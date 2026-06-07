import type { CryptoPrice } from "./dashboardTypes";

export const COINGECKO_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true";

type CoinGeckoCoin = {
  usd?: number;
  usd_24h_change?: number;
};

type CoinGeckoPayload = {
  bitcoin?: CoinGeckoCoin;
  ethereum?: CoinGeckoCoin;
};

export const emptyCryptoPrices: CryptoPrice[] = [
  {
    id: "bitcoin",
    label: "Bitcoin",
    ticker: "BTC",
    usd: null,
    usd24hChange: null,
  },
  {
    id: "ethereum",
    label: "Ethereum",
    ticker: "ETH",
    usd: null,
    usd24hChange: null,
  },
];

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  const response = await fetch(COINGECKO_PRICE_URL);

  if (!response.ok) {
    throw new Error("Unable to load crypto prices.");
  }

  const data = (await response.json()) as CoinGeckoPayload;

  return emptyCryptoPrices.map((coin) => {
    const source = data[coin.id];

    if (
      typeof source?.usd !== "number" ||
      typeof source.usd_24h_change !== "number"
    ) {
      throw new Error("Crypto price response is missing market data.");
    }

    return {
      ...coin,
      usd: source.usd,
      usd24hChange: source.usd_24h_change,
    };
  });
}

export function formatUsdPrice(value: number | null): string {
  if (value === null) return "Loading";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}
