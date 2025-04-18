import React from 'react';
import './styles.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

function List({ stock }) {
  if (!stock) {
    return <tr><td colSpan="6">No Data Available</td></tr>;
  }

  // Destructure stock data for easy usage
  const stockSymbol = stock?.symbol || "";
  const stockName = stock?.longName || "";
  const currentPrice = stock?.regularMarketPrice ? `₹${parseFloat(stock.regularMarketPrice).toLocaleString()}` : "-";
  const openPrice = stock?.regularMarketOpen ? `₹${parseFloat(stock.regularMarketOpen).toLocaleString()}` : "-";
  const prevClose = stock?.regularMarketPreviousClose ? `₹${parseFloat(stock.regularMarketPreviousClose).toLocaleString()}` : "-";
  const highPrice = stock?.regularMarketDayHigh ? `₹${parseFloat(stock.regularMarketDayHigh).toLocaleString()}` : "-";
  const lowPrice = stock?.regularMarketDayLow ? `₹${parseFloat(stock.regularMarketDayLow).toLocaleString()}` : "-";
  const volume = stock?.regularMarketVolume ? parseFloat(stock.regularMarketVolume).toLocaleString() : "-";
  const priceChange = parseFloat(stock?.regularMarketChange) || 0;
  const priceChangePercent = parseFloat(stock?.regularMarketChangePercent) || 0;

  return (
    <Link to={`/stock/${stockSymbol}`}>
      <tr className="list-row">
        <Tooltip title="Stock Symbol and Name" placement="bottom-start">
          <td className="td-name">
            <div className="name-col">
              <p className="stock-symbol">{stockSymbol}</p>
              <p className="stock-name">{stockName}</p>
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Price Change In 24Hrs" placement="bottom-start">
          <td className="chip-flex">
            <div
              className={`price-chip ${priceChange < 0 ? 'chip-red' : ''}`}
            >
              {priceChangePercent !== 0 ? `${priceChangePercent.toFixed(2)}%` : "-"}
            </div>
            <div
              className={`icon-chip ${priceChange < 0 ? 'chip-red' : ''}`}
            >
              {priceChange > 0 ? (
                <TrendingUpRoundedIcon />
              ) : (
                <TrendingDownRoundedIcon />
              )}
            </div>
          </td>
        </Tooltip>

        <Tooltip title="Current Price" placement="bottom-start">
          <td>
            <h3
              className="stock-price td-right-align"
              style={{
                color: priceChange < 0 ? 'var(--red)' : 'var(--green)',
              }}
            >
              {currentPrice}
            </h3>
          </td>
        </Tooltip>

        <Tooltip title="Open Price" placement="bottom-start">
          <td>
            <p className="stock-details td-right-align">{openPrice}</p>
          </td>
        </Tooltip>

        <Tooltip title="Previous Close" placement="bottom-start">
          <td>
            <p className="stock-details td-right-align">{prevClose}</p>
          </td>
        </Tooltip>

        <Tooltip title="High/Low Prices" placement="bottom-start">
          <td>
            <p className="stock-details td-right-align">{highPrice} | {lowPrice}</p>
          </td>
        </Tooltip>

        <Tooltip title="Volume" placement="bottom-start">
          <td>
            <p className="stock-details td-right-align">{volume}</p>
          </td>
        </Tooltip>
      </tr>
    </Link>
  );
}

export default List;
