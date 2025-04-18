import axios from "axios";

export const getCoinPrices = async (id, days, signal) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=${days}&interval=daily`,
      { signal }
    );
    
    if (!response.data || !response.data.prices) {
      console.error("Invalid price data:", response.data);
      return [];
    }

    return response.data.prices;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("API Rate Limit Hit! Retrying in 10 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Retry after 10 sec
      return getCoinPrices(id, days, signal);
    }
    console.error("Error fetching coin prices:", error);
    return [];
  }
};
