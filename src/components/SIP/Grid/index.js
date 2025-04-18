
import React, { useEffect, useState } from "react";
import "./styles.css";


const Grid = ({ fund }) => {
  // Determine if the fund is in profit or loss
  const profitStatus = fund.regularMarketChange >= 0 ? 'profit' : 'loss';
  
  return (
    <div className={`fund-card ${profitStatus} ${fund.category.toLowerCase().replace(' ', '-')}`}>
      <div className="fund-header">
        <h3>{fund.longName}</h3>
        <span className="fund-symbol">{fund.symbol}</span>
        <span className={`category ${fund.category.toLowerCase().replace(' ', '-')}`}>
          {fund.category}
        </span>
      </div>
      
      <div className="fund-price">
        <div className="price">₹{fund.regularMarketPrice?.toFixed(2) || 'NA'}</div>
        <div className={`change ${fund.regularMarketChange >= 0 ? 'positive' : 'negative'}`}>
          {fund.regularMarketChange >= 0 ? '+' : ''}{fund.regularMarketChange?.toFixed(2) || 'NA'} 
          ({fund.regularMarketChangePercent >= 0 ? '+' : ''}{fund.regularMarketChangePercent?.toFixed(2) || 'NA'}%)
        </div>
      </div>
      
      <div className="fund-details">
        <div className="returns-section">
          <h4>Annualized Returns</h4>
          <div className="returns-grid">
            <div>
              <span>1 Year</span>
              <span className="return-value">{fund.returns['1Y']}%</span>
            </div>
            <div>
              <span>3 Years</span>
              <span className="return-value">{fund.returns['3Y']}%</span>
            </div>
            <div>
              <span>5 Years</span>
              <span className="return-value highlight">{fund.returns['5Y']}%</span>
            </div>
            <div>
              <span>7 Years</span>
              <span className="return-value">{fund.returns['7Y']}%</span>
            </div>
            <div>
              <span>10 Years</span>
              <span className="return-value">{fund.returns['10Y']}%</span>
            </div>
          </div>
        </div>
        
        <div className="fund-meta">
          <div>
            <span>Minimum SIP</span>
            <span>₹{fund.minSipAmount}</span>
          </div>
          <div>
            <span>Risk Level</span>
            <span className={`risk ${fund.riskLevel.toLowerCase().replace(' ', '-')}`}>
              {fund.riskLevel}
            </span>
          </div>
          <div>
            <span>5-Year CAGR</span>
            <span className="highlight">{fund.cagr}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
