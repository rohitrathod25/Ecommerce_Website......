import React from 'react';
import './styles.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

function List({ coin }) {
  if (!coin) {
    return <tr><td colSpan="6">No Data Available</td></tr>;
  }

  return (
    <Link to={`/coin/${coin.id}`}>
    <tr className="list-row">
      <Tooltip title="Coin Logo" placement="bottom-start">
        <td className="td-image">
          <img src={coin.image || ""} alt={coin.name || "Unknown"} className="coin-logo" />
        </td>
      </Tooltip>

      <Tooltip title="Coin Info" placement="bottom-start">
        <td className="td-name"> {/* ✅ New class to prevent conflicts */}
          <div className="name-col">
            <p className="coin-symbol">{coin.symbol?.toUpperCase() || "N/A"}</p>
            <p className="coin-name">{coin.name || "Unknown"}</p>
          </div>
        </td>
      </Tooltip>

      <Tooltip title="Price Change In 24Hrs" placement="bottom-start">
        <td className="chip-flex">
          <div
            className={`price-chip ${
              (coin.price_change_percentage_24h ?? 0) < 0 ? 'chip-red' : ''
            }`}
          >
            {coin.price_change_percentage_24h !== undefined
              ? coin.price_change_percentage_24h.toFixed(2) + "%"
              : "N/A"}
          </div>
          <div
            className={`icon-chip ${
              (coin.price_change_percentage_24h ?? 0) < 0 ? 'chip-red' : ''
            } td-icon`}
          >
            {coin.price_change_percentage_24h > 0 ? (
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
            className="coin-price td-right-align"
            style={{
              color: (coin.price_change_percentage_24h ?? 0) < 0 ? 'var(--red)' : 'var(--green)',
            }}
          >
            ₹{coin.current_price ? coin.current_price.toLocaleString() : "N/A"}
          </h3>
        </td>
      </Tooltip>

      <Tooltip title="Total Volume" placement="bottom-start">
        <td>
          <p className="total_volume td-right-align td-total-volume">
            ₹{coin.total_volume ? coin.total_volume.toLocaleString() : "N/A"}
          </p>
        </td>
      </Tooltip>

      <Tooltip title="Market Cap" placement="bottom-start">
        <td>
          <p className="total_volume td-right-align">
            ₹{coin.market_cap ? coin.market_cap.toLocaleString() : "N/A"}
          </p>
        </td>
      </Tooltip>
    </tr>
    </Link>
  );
}

export default List;
