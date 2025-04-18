import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import axios from "axios";

function Grid({ stock }) {
  const [setChartData] = useState({
    series: [{ name: "Stock Price", data: [] }],
    options: {
      chart: { id: "stock-chart", type: "line", height: 300 },
      title: { text: "Stock Price (Last 30 Days)", align: "center" },
      xaxis: { type: "datetime", labels: { format: "dd MMM" } },
      yaxis: { title: { text: "Price (₹)" } },
    },
  });

  const stockSymbol = stock?.symbol?.replace('.NS', '') || "";
  const stockName = stock?.longName || stock?.shortName || "";
  const currentPrice = stock?.regularMarketPrice ? `₹${parseFloat(stock.regularMarketPrice).toLocaleString()}` : "-";
  const openPrice = stock?.regularMarketOpen ? `₹${parseFloat(stock.regularMarketOpen).toLocaleString()}` : "-";
  const prevClose = stock?.regularMarketPreviousClose ? `₹${parseFloat(stock.regularMarketPreviousClose).toLocaleString()}` : "-";
  const highPrice = stock?.regularMarketDayHigh ? `₹${parseFloat(stock.regularMarketDayHigh).toLocaleString()}` : "-";
  const lowPrice = stock?.regularMarketDayLow ? `₹${parseFloat(stock.regularMarketDayLow).toLocaleString()}` : "-";
  const volume = stock?.regularMarketVolume ? parseFloat(stock.regularMarketVolume).toLocaleString() : "-";
  const priceChange = parseFloat(stock?.regularMarketChange) || 0;
  const priceChangePercent = parseFloat(stock?.regularMarketChangePercent) || 0;
  const marketCap = stock?.marketCap ? `₹${(stock.marketCap / 10000000).toLocaleString()} Cr` : "-";

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchStockHistory = async () => {
      try {
        const response = await axios.get(`YOUR_API_URL_HERE/${stockSymbol}/history?period=30d`);
        const historicalData = response.data.map(item => ({
          x: new Date(item.timestamp),
          y: item.close_price,
        }));

        setChartData(prevState => ({
          ...prevState,
          series: [{ name: `${stockSymbol} Stock Price`, data: historicalData }],
        }));
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockHistory();
  }, [stockSymbol]);

  if (!stock) return null;

  return (
    <Link to={`/stock/${stockSymbol}`} className="grid-link">
      <div className={`grid-container ${priceChange < 0 ? "grid-container-red" : ""}`}>
        <div className="info-flex">
          <div className="name-col">
            {stockSymbol && (
              <div className="symbol-container">
                <div className="stock-symbol">{stockSymbol}</div>
                {stockName && <p className="stock-name">{stockName}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="chip-flex">
          <div className={`price-chip ${priceChange < 0 ? "chip-red" : "chip-green"}`}>
            {priceChangePercent.toFixed(2)}%
          </div>
          <div className={`icon-chip ${priceChange < 0 ? "chip-red" : "chip-green"}`}>
            {priceChange >= 0 ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
          </div>
        </div>

        <div className="info-container">
          <h3 className="stock-price" style={{ color: priceChange < 0 ? "var(--red)" : "var(--green)" }}>
            {currentPrice}
          </h3>
          <div className="price-details">
            <p className="stock-details">Open: {openPrice}</p>
            <p className="stock-details">Prev Close: {prevClose}</p>
            <p className="stock-details">Day Range: {lowPrice} - {highPrice}</p>
            <p className="stock-details">Volume: {volume}</p>
            <p className="stock-details">Market Cap: {marketCap}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Grid;