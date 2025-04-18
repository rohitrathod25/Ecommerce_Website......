import axios from "axios";

export const getCoinData = async (id, signal) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      { signal }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("API Rate Limit Hit! Retrying in 10 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Retry after 10 sec
      return getCoinData(id, signal);
    }
    console.error("Error fetching coin data:", error);
    return null;
  }
};
