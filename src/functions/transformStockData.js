import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from '../components/Common/Header';
import TabsComponent from '../components/Stock/Tabs';
import Search from '../components/Stock/Search';
import PaginationComponent from '../components/Stock/Pagination';
import Loader from '../components/Common/Loader';

const transformStockData = (rawStocks) => {
  if (!Array.isArray(rawStocks)) {
    console.error('transformStockData: Expected array, received', rawStocks);
    return [];
  }

  return rawStocks.map((stock) => {
    const symbol = stock.symbol || stock.Code || stock.ticker || `STOCK_${Math.random().toString(36).substr(2, 5)}`;
    const name = stock.companyName || stock.name || stock.longName || stock.shortName || symbol;
    
    const lastPrice = parseFloat(
      stock.lastPrice || stock.lp || stock.regularMarketPrice || stock.price || stock.close || 0
    );
    
    const change = parseFloat(
      stock.change || stock.ch || stock.regularMarketChange || stock.netChange || 0
    );

    // Safely calculate percentage change
    let changePercent;
    if (stock.pChange !== undefined) {
      changePercent = parseFloat(stock.pChange);
    } else if (stock.chp !== undefined) {
      changePercent = parseFloat(stock.chp);
    } else if (stock.regularMarketChangePercent !== undefined) {
      changePercent = parseFloat(stock.regularMarketChangePercent);
    } else if (stock.percentageChange !== undefined) {
      changePercent = parseFloat(stock.percentageChange);
    } else {
      const denominator = lastPrice - change;
      changePercent = denominator !== 0 ? (change / denominator) * 100 : 0;
    }

    const volume = parseInt(
      stock.totalTradedVolume || stock.volume || stock.regularMarketVolume || stock.tradedVolume || 0
    );
    
    const marketCap = parseFloat(
      stock.marketCap || stock.mcap || stock.marketCapitalization || 
      (stock.sharesOutstanding ? stock.sharesOutstanding * lastPrice : 0) || 0
    );

    return {
      code: symbol.toUpperCase(),
      name: name.trim(),
      lp: lastPrice,
      ch: change,
      chp: changePercent.toFixed(2),
      volume: volume,
      marketCap: marketCap,
      isGain: change >= 0,
      absoluteChange: Math.abs(change),
      _raw: stock // Preserve original data
    };
  }).filter(stock => stock.code && !isNaN(stock.lp));
};

function FixedDepositPage() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://latest-stock-price.p.rapidapi.com/price', {
        params: { Indices: 'NIFTY 100' },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
        }
      });

      console.log('API Response:', response.data);
      const transformedData = transformStockData(response.data);
      console.log('Transformed Data:', transformedData);
      setStocks(transformedData);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.response?.data?.message || 
              error.message || 
              'Failed to fetch stock data. Please try again later.');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStockData(); }, []);

  const handlePageChange = (_, value) => setPage(value);
  const onSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.code.toLowerCase().includes(search) || 
    stock.name.toLowerCase().includes(search)
  );

  const paginatedStocks = filteredStocks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="fixed-deposit-page">
      <Header />
      <Search search={search} onSearchChange={onSearchChange} />
      
      {loading ? <Loader /> : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchStockData} className="retry-button">
            Retry
        </button>
        </div>
      ) : (
        <>
          <TabsComponent stocks={paginatedStocks} />
          <PaginationComponent 
            page={page} 
            handlePageChange={handlePageChange} 
            count={Math.ceil(filteredStocks.length / perPage)} 
          />
        </>
      )}
    </div>
  );
}

FixedDepositPage.propTypes = {
  // Define prop types if needed
};

export default FixedDepositPage;