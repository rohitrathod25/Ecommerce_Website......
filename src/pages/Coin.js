import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Common/Loader";
import Header from "../components/Common/Header";
import { coinObject } from "../functions/convertObject";
import List from "../components/DashBoard/List";
import CoinInfo from "../components/Coin/CoinInfo";
import { getCoinData } from "../functions/getCoinData";
import { getCoinPrices } from "../functions/getCoinPrices";
import LineChart from "../components/Coin/LineChart";
import { convertDate } from "../functions/convertDate";
import SelectDays from "../components/Coin/SelectDays";
import { settingChartData } from "../functions/settingChartData";

function CoinPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coinData, setCoinData] = useState();
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState(false);

  const getData = useCallback(async (coinId, daysValue) => {
    if (!coinId) return;

    const cachedData = localStorage.getItem(`coinData-${coinId}`);
    const cachedTimestamp = localStorage.getItem(`coinDataTimestamp-${coinId}`);

    // Use cache if data is <5 min old
    if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 5 * 60 * 1000) {
      console.log("Using cached data for:", coinId);
      setCoinData(JSON.parse(cachedData));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      // Fetch coin data
      const data = await getCoinData(coinId);
      if (!data) throw new Error("API call failed");

      const formattedData = coinObject(data);
      setCoinData(formattedData);

      // Cache data
      localStorage.setItem(`coinData-${coinId}`, JSON.stringify(formattedData));
      localStorage.setItem(`coinDataTimestamp-${coinId}`, Date.now());

      // Fetch & update chart data
      const prices = await getCoinPrices(coinId, daysValue);
      settingChartData(setChartData, prices);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setIsLoading(false);

      // If API fails, fallback to last cached data
      if (cachedData) {
        setCoinData(JSON.parse(cachedData));
      }
    }
  }, []);

  const handleDaysChange = async (event) => {
    const selectedDays = event.target.value;
    setDays(selectedDays);
    setIsLoading(true);
    await getData(id, selectedDays);
    setIsLoading(false);
  };

  useEffect(() => {
    getData(id, days);
  }, [id, days]);

  return (
    <div>
      <Header />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>
          <p>⚠️ Error fetching data. Showing last available data.</p>
        </div>
      ) : coinData ? (
        <>
          <div className="grey-wrapper" style={{ padding: "0rem 1rem" }}>
            <List coin={coinData} />
          </div>
          <div className="grey-wrapper">
            <SelectDays days={days} handleDaysChange={handleDaysChange} />
            <LineChart chartData={chartData} />
          </div>
          <CoinInfo heading={coinData?.name || "N/A"} desc={coinData?.desc || "No description available"} />
        </>
      ) : (
        <p>⚠️ No data available.</p>
      )}
    </div>
  );
}

export default CoinPage;
