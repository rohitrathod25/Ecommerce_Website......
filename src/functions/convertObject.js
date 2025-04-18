export const coinObject = (data) => {
  if (!data || !data.market_data) return null; // ✅ Prevents crash if API response is missing data

  return {
    id: data.id,
    image: data.image?.large || "", // ✅ Ensure image exists
    name: data.name || "Unknown",
    symbol: data.symbol?.toUpperCase() || "N/A",
    desc: data.description?.en || "No description available", // ✅ Fixed possible error
    current_price: data.market_data.current_price?.inr || 0, 
    price_change_percentage_24h: data.market_data.price_change_percentage_24h || 0,
    total_volume: data.market_data.total_volume?.inr || 0,
    market_cap: data.market_data.market_cap?.inr || 0,
  };
};
