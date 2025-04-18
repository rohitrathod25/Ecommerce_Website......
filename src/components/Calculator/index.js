import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import "./styles.css";
import axios from "axios";
import { Savings, TrendingUp } from "@mui/icons-material";

const Calculator = () => {
  const [age, setAge] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("10");
  const [savings, setSavings] = useState("");
  const [investmentPlan, setInvestmentPlan] = useState(null);
  const [allocations, setAllocations] = useState({
    crypto: "20",
    stocks: "20",
    fixedDeposit: "20",
    sip: "20",
    gold: "10",
    realEstate: "10"
  });
  const [cryptoData, setCryptoData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [sipData] = useState([
    { id: 1, name: 'Axis Bluechip Fund', category: 'Large Cap', returns: 12.5 },
    { id: 2, name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', returns: 11.8 },
    { id: 3, name: 'Parag Parikh Flexi Cap Fund', category: 'Flexi Cap', returns: 14.2 },
    { id: 4, name: 'SBI Small Cap Fund', category: 'Small Cap', returns: 16.3 },
    { id: 5, name: 'Nippon India Growth Fund', category: 'Mid Cap', returns: 15.1 },
    
  ]);
  const [loading, setLoading] = useState({
    crypto: true,
    stocks: true
  });
  const [currentPage, setCurrentPage] = useState({
    crypto: 1,
    stocks: 1
  });
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedSips, setSelectedSips] = useState([]);
  const [selectedFds, setSelectedFds] = useState([]);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showSipDropdown, setShowSipDropdown] = useState(false);
  const [showFdDropdown, setShowFdDropdown] = useState(false);
  const [useNext50, setUseNext50] = useState(false);
  const [fdAmount, setFdAmount] = useState(100000);
  const [fdTenure, setFdTenure] = useState(5);
  const [selectedBank, setSelectedBank] = useState("State Bank of India");
  const [fdReturns, setFdReturns] = useState(null);
  const [showFdProjection, setShowFdProjection] = useState(false);
  const itemsPerPage = 10;
  const totalItems = 100;
  const inflationRate = 5; // 5% inflation rate

  // NIFTY 50 and Next 50 stock symbols
  const symbols = [
    "RELIANCE.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "TCS.NS",
    "KOTAKBANK.NS", "HINDUNILVR.NS", "ITC.NS", "LT.NS", "SBIN.NS",
    "AXISBANK.NS", "BAJFINANCE.NS", "HCLTECH.NS", "ASIANPAINT.NS", "MARUTI.NS",
    "SUNPHARMA.NS", "ULTRACEMCO.NS", "NESTLEIND.NS", "TITAN.NS", "WIPRO.NS",
    "ONGC.NS", "POWERGRID.NS", "NTPC.NS", "BAJAJ-AUTO.NS", "TECHM.NS",
    "HDFCLIFE.NS", "GRASIM.NS", "INDUSINDBK.NS", "DRREDDY.NS", "JSWSTEEL.NS",
    "CIPLA.NS", "TATAMOTORS.NS", "COALINDIA.NS", "BPCL.NS", "BRITANNIA.NS",
    "SHRIRAMFIN.NS", "DIVISLAB.NS", "HEROMOTOCO.NS", "ADANIPORTS.NS", "TATACONSUM.NS",
    "EICHERMOT.NS", "ADANIENT.NS", "HDFCAMC.NS", "ICICIGI.NS",
    "SBILIFE.NS", "IOC.NS", "GAIL.NS", "VEDL.NS", "UPL.NS"
  ];
  
  const next50Symbols = [
    "DMART.NS", "LICI.NS", "HAL.NS", "ADANIGREEN.NS", "INDIGO.NS",
    "SIEMENS.NS", "IOC.NS", "NAUKRI.NS", "AMBUJACEM.NS", "PFC.NS",
    "GODREJCP.NS", "DLF.NS", "SRF.NS", "MARICO.NS", "BOSCHLTD.NS",
    "HAVELLS.NS", "ABB.NS", "TATAPOWER.NS", "ICICIPRULI.NS", "BANKBARODA.NS",
    "CANBK.NS", "AUROPHARMA.NS", "MPHASIS.NS", "IOB.NS", "IDBI.NS",
    "UNIONBANK.NS", "CUMMINSIND.NS", "LUPIN.NS", "ASHOKLEY.NS", "SAIL.NS",
    "IDFCFIRSTB.NS", "POLYCAB.NS", "MOTHERSON.NS", "INDUSTOWER.NS", "TVSMOTOR.NS",
    "DABUR.NS", "CONCOR.NS", "BHARATFORG.NS", "PERSISTENT.NS", "TIINDIA.NS",
    "JINDALSTEL.NS", "RECLTD.NS", "JUBLFOOD.NS", "TORNTPHARM.NS", "UPL.NS",
    "ABCAPITAL.NS", "OBEROIRLTY.NS", "ADANIPOWER.NS", "GAIL.NS", "IRFC.NS"
  ];

  // FD bank rates data
  const bankRates = [
    { id: 1, name: 'State Bank of India', regularRate: 6.50, seniorRate: 7.00, minAmount: 1000, minTenure: 7 },
    { id: 2, name: 'HDFC Bank', regularRate: 6.75, seniorRate: 7.25, minAmount: 5000, minTenure: 12 },
    { id: 3, name: 'ICICI Bank', regularRate: 6.60, seniorRate: 7.10, minAmount: 10000, minTenure: 7 },
    { id: 4, name: 'Axis Bank', regularRate: 6.70, seniorRate: 7.20, minAmount: 5000, minTenure: 7 },
    { id: 5, name: 'Punjab National Bank', regularRate: 6.25, seniorRate: 6.75, minAmount: 1000, minTenure: 7 },
    { id: 7, name: 'Bank of Baroda', regularRate: 6.30, seniorRate: 6.80, minAmount: 1000, minTenure: 7 },
    { id: 6, name: 'Suryoday Small Finance Bank FD', regularRate: 9.10, seniorRate: 9.80, minAmount: 1000, minTenure: 7 },
    { id: 6, name: 'North East SF Bank', regularRate: 9, seniorRate: 9.80, minAmount: 1000, minTenure: 7 },
    { id: 6, name: 'Shivalik SF Bank', regularRate: 8.80, seniorRate: 8.80, minAmount: 1000, minTenure: 7 },


  ];

  // Fetch crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(prev => ({...prev, crypto: true}));
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=${totalItems}&page=1&sparkline=false`
        );
        setCryptoData(response.data);
        setLoading(prev => ({...prev, crypto: false}));
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setLoading(prev => ({...prev, crypto: false}));
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(prev => ({...prev, stocks: true}));
        
        const queryString = (useNext50 ? next50Symbols : symbols).join(',');
        
        const response = await axios.get(
          `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes`,
          {
            params: {
              region: 'IN',
              symbols: queryString
            },
            headers: {
              'X-RapidAPI-Key': '13e3bd2be3msh555a7b67cb85664p164a29jsnee1c2d0378a1',
              'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
          }
        );

        const formattedStocks = response.data.quoteResponse.result.map(stock => ({
          id: stock.symbol,
          symbol: stock.symbol.replace('.NS', ''),
          name: stock.shortName || stock.longName || stock.symbol.replace('.NS', ''),
          price: stock.regularMarketPrice,
          change: stock.regularMarketChangePercent,
          marketCap: stock.marketCap,
          currency: stock.currency,
          exchange: stock.exchange
        }));

        setStockData(formattedStocks);
        setLoading(prev => ({...prev, stocks: false}));
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(prev => ({...prev, stocks: false}));
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, [useNext50]);

  // Calculate FD returns
  const calculateFdReturns = () => {
    const bank = bankRates.find(b => b.name === selectedBank) || bankRates[0];
    const rate = bank.regularRate;
    const interest = (fdAmount * rate * fdTenure) / 100;
    
    setFdReturns({
      maturityAmount: (fdAmount + interest).toFixed(2),
      interestEarned: interest.toFixed(2),
      bankName: bank.name,
      rate: rate
    });
    
    setShowFdProjection(true);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 18 && parseInt(value) <= 100)) {
      setAge(value);
    }
  };

  const handleInvestmentPeriodChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 1 && parseInt(value) <= 30)) {
      setInvestmentPeriod(value);
    }
  };

  const handleSavingsChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setSavings(value);
    }
  };

  const handleAllocationChange = (e, field) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setAllocations(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCryptos(prev => {
      const exists = prev.some(c => c.id === crypto.id);
      if (exists) {
        return prev.filter(c => c.id !== crypto.id);
      } else if (prev.length < 5) {
        return [...prev, crypto];
      }
      return prev;
    });
  };

  const handleStockSelect = (stock) => {
    setSelectedStocks(prev => {
      const exists = prev.some(s => s.id === stock.id);
      if (exists) {
        return prev.filter(s => s.id !== stock.id);
      } else if (prev.length < 5) {
        return [...prev, stock];
      }
      return prev;
    });
  };

  const handleSipSelect = (sip) => {
    setSelectedSips(prev => {
      const exists = prev.some(s => s.id === sip.id);
      if (exists) {
        return prev.filter(s => s.id !== sip.id);
      } else if (prev.length < 5) {
        return [...prev, sip];
      }
      return prev;
    });
  };

  const handleFdSelect = (bank) => {
    setSelectedFds(prev => {
      const exists = prev.some(b => b.id === bank.id);
      if (exists) {
        return prev.filter(b => b.id !== bank.id);
      } else if (prev.length < 5) {
        return [...prev, bank];
      }
      return prev;
    });
  };

  const handlePageChange = (type, newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(prev => ({...prev, [type]: newPage}));
    }
  };

  // Calculate returns with inflation adjustment
  const calculateReturns = (principal, rate, years) => {
    const futureValue = principal * Math.pow(1 + rate/100, years);
    const returns = futureValue - principal;
    
    // Apply inflation adjustment
    const inflationFactor = Math.pow(1 + inflationRate/100, years);
    const realFutureValue = futureValue / inflationFactor;
    const realReturns = returns / inflationFactor;
    
    return {
      nominal: {
        futureValue: futureValue,
        returns: returns
      },
      real: {
        futureValue: realFutureValue,
        returns: realReturns
      }
    };
  };

  const calculateInvestmentPlan = () => {
    if (selectedCryptos.length === 0 || selectedStocks.length === 0 || 
        selectedSips.length === 0 || selectedFds.length === 0) {
      alert("Please select at least one option from Cryptocurrencies, Stocks, SIPs, and Fixed Deposits");
      return;
    }

    const currentAge = age === "" ? 25 : parseInt(age);
    const monthlySavings = savings === "" ? 1000 : parseFloat(savings);
    const years = investmentPeriod === "" ? 10 : parseInt(investmentPeriod);
    
    const cryptoAlloc = allocations.crypto === "" ? 20 : parseFloat(allocations.crypto);
    const stockAlloc = allocations.stocks === "" ? 20 : parseFloat(allocations.stocks);
    const fdAlloc = allocations.fixedDeposit === "" ? 20 : parseFloat(allocations.fixedDeposit);
    const sipAlloc = allocations.sip === "" ? 20 : parseFloat(allocations.sip);
    const goldAlloc = allocations.gold === "" ? 0 : parseFloat(allocations.gold);
    const realEstateAlloc = allocations.realEstate === "" ? 0 : parseFloat(allocations.realEstate);
    
    // Calculate total allocation only for active asset classes
    const activeAllocations = [cryptoAlloc, stockAlloc, fdAlloc, sipAlloc];
    if (goldAlloc > 0) activeAllocations.push(goldAlloc);
    if (realEstateAlloc > 0) activeAllocations.push(realEstateAlloc);
    
    const totalAlloc = activeAllocations.reduce((sum, alloc) => sum + alloc, 0);
    const normalizedCrypto = (cryptoAlloc / totalAlloc) * 100;
    const normalizedStock = (stockAlloc / totalAlloc) * 100;
    const normalizedFD = (fdAlloc / totalAlloc) * 100;
    const normalizedSIP = (sipAlloc / totalAlloc) * 100;
    const normalizedGold = goldAlloc > 0 ? (goldAlloc / totalAlloc) * 100 : 0;
    const normalizedRealEstate = realEstateAlloc > 0 ? (realEstateAlloc / totalAlloc) * 100 : 0;

    // Create crypto entries with individual returns
    const cryptoMonthly = (monthlySavings * (normalizedCrypto/100));
    const cryptoPrincipalPerCoin = (cryptoMonthly / selectedCryptos.length) * 12 * years;
    const cryptoAvgReturn = 15; // Average for crypto
    
    const cryptoEntries = selectedCryptos.map(crypto => {
      const cryptoReturns = calculateReturns(cryptoPrincipalPerCoin, cryptoAvgReturn, years);
      return {
        type: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        allocation: (normalizedCrypto / selectedCryptos.length).toFixed(0),
        amount: (cryptoMonthly / selectedCryptos.length).toFixed(2),
        nominalReturns: cryptoReturns.nominal.returns.toFixed(2),
        realReturns: cryptoReturns.real.returns.toFixed(2),
        nominalFutureValue: cryptoReturns.nominal.futureValue.toFixed(2),
        realFutureValue: cryptoReturns.real.futureValue.toFixed(2),
        avgReturns: cryptoAvgReturn,
        image: crypto.image,
        assetType: 'crypto'
      };
    });

    // Create stock entries with individual returns
    const stockMonthly = (monthlySavings * (normalizedStock/100));
    const stockPrincipalPerStock = (stockMonthly / selectedStocks.length) * 12 * years;
    const stockAvgReturn = 12; // Average for stocks
    
    const stockEntries = selectedStocks.map(stock => {
      const stockReturns = calculateReturns(stockPrincipalPerStock, stockAvgReturn, years);
      return {
        type: stock.name,
        symbol: stock.symbol.toUpperCase(),
        allocation: (normalizedStock / selectedStocks.length).toFixed(0),
        amount: (stockMonthly / selectedStocks.length).toFixed(2),
        nominalReturns: stockReturns.nominal.returns.toFixed(2),
        realReturns: stockReturns.real.returns.toFixed(2),
        nominalFutureValue: stockReturns.nominal.futureValue.toFixed(2),
        realFutureValue: stockReturns.real.futureValue.toFixed(2),
        avgReturns: stockAvgReturn,
        assetType: 'stock'
      };
    });

    // Create FD entries with individual returns
    const fdMonthly = (monthlySavings * (normalizedFD/100));
    const fdPrincipalPerBank = (fdMonthly / selectedFds.length) * 12 * years;
    
    const fdEntries = selectedFds.map(fd => {
      const fdReturns = calculateReturns(fdPrincipalPerBank, fd.regularRate, years);
      return {
        type: "Fixed Deposit",
        allocation: (normalizedFD / selectedFds.length).toFixed(0),
        amount: (fdMonthly / selectedFds.length).toFixed(2),
        nominalReturns: fdReturns.nominal.returns.toFixed(2),
        realReturns: fdReturns.real.returns.toFixed(2),
        nominalFutureValue: fdReturns.nominal.futureValue.toFixed(2),
        realFutureValue: fdReturns.real.futureValue.toFixed(2),
        avgReturns: fd.regularRate,
        assetType: 'fd',
        bankName: fd.name
      };
    });

    // Create SIP entries with individual returns
    const sipMonthly = (monthlySavings * (normalizedSIP/100));
    const sipPrincipalPerFund = (sipMonthly / selectedSips.length) * 12 * years;
    
    const sipEntries = selectedSips.map(sip => {
      const sipReturns = calculateReturns(sipPrincipalPerFund, sip.returns, years);
      return {
        type: sip.name,
        allocation: (normalizedSIP / selectedSips.length).toFixed(0),
        amount: (sipMonthly / selectedSips.length).toFixed(2),
        nominalReturns: sipReturns.nominal.returns.toFixed(2),
        realReturns: sipReturns.real.returns.toFixed(2),
        nominalFutureValue: sipReturns.nominal.futureValue.toFixed(2),
        realFutureValue: sipReturns.real.futureValue.toFixed(2),
        avgReturns: sip.returns,
        category: sip.category,
        assetType: 'sip'
      };
    });

    // Create Gold entry if allocation > 0
    let goldEntry = null;
    if (normalizedGold > 0) {
      const goldMonthly = (monthlySavings * (normalizedGold/100));
      const goldPrincipal = goldMonthly * 12 * years;
      const goldAvgReturn = 7; // 7% average return for gold
      const goldReturns = calculateReturns(goldPrincipal, goldAvgReturn, years);
      
      goldEntry = {
        type: "Gold (Average)",
        allocation: normalizedGold.toFixed(0),
        amount: goldMonthly.toFixed(2),
        nominalReturns: goldReturns.nominal.returns.toFixed(2),
        realReturns: goldReturns.real.returns.toFixed(2),
        nominalFutureValue: goldReturns.nominal.futureValue.toFixed(2),
        realFutureValue: goldReturns.real.futureValue.toFixed(2),
        avgReturns: goldAvgReturn,
        assetType: 'gold'
      };
    }

    // Create Real Estate entry if allocation > 0
    let realEstateEntry = null;
    if (normalizedRealEstate > 0) {
      const realEstateMonthly = (monthlySavings * (normalizedRealEstate/100));
      const realEstatePrincipal = realEstateMonthly * 12 * years;
      const realEstateAvgReturn = 9; // 9% average return for real estate
      const realEstateReturns = calculateReturns(realEstatePrincipal, realEstateAvgReturn, years);
      
      realEstateEntry = {
        type: "Real Estate (Average)",
        allocation: normalizedRealEstate.toFixed(0),
        amount: realEstateMonthly.toFixed(2),
        nominalReturns: realEstateReturns.nominal.returns.toFixed(2),
        realReturns: realEstateReturns.real.returns.toFixed(2),
        nominalFutureValue: realEstateReturns.nominal.futureValue.toFixed(2),
        realFutureValue: realEstateReturns.real.futureValue.toFixed(2),
        avgReturns: realEstateAvgReturn,
        assetType: 'realEstate'
      };
    }

    // Combine all entries
    const planItems = [
      ...cryptoEntries, 
      ...stockEntries, 
      ...fdEntries, 
      ...sipEntries
    ];
    
    if (goldEntry) planItems.push(goldEntry);
    if (realEstateEntry) planItems.push(realEstateEntry);

    setInvestmentPlan(planItems);
    calculateFdReturns();
  };

  const paginatedData = (data, type) => data.slice(
    (currentPage[type] - 1) * itemsPerPage,
    currentPage[type] * itemsPerPage
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate summary values
  const calculateSummaryValues = () => {
    if (!investmentPlan) return null;
    
    const monthly = savings === "" ? 1000 : parseFloat(savings);
    const years = investmentPeriod === "" ? 10 : parseInt(investmentPeriod);
    const totalInvestment = monthly * 12 * years;
    
    const nominalReturns = investmentPlan.reduce((sum, item) => sum + parseFloat(item.nominalReturns), 0);
    const nominalFutureValue = totalInvestment + nominalReturns;
    
    const realReturns = investmentPlan.reduce((sum, item) => sum + parseFloat(item.realReturns), 0);
    const realFutureValue = totalInvestment + realReturns;
    
    return {
      totalInvestment,
      nominal: {
        returns: nominalReturns,
        futureValue: nominalFutureValue
      },
      real: {
        returns: realReturns,
        futureValue: realFutureValue
      },
      years,
      inflationRate
    };
  };

  const summaryValues = calculateSummaryValues();

  return (
    <div className="calculator-wrapper">
      <Header />
      <div className="calculator-container">
        <h2 className="calculator-header">Investment Plan Calculator</h2>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Enter Your Age:</label>
          <input
            type="number"
            value={age}
            onChange={handleAgeChange}
            className="calculator-input"
            min="18"
            max="100"
            placeholder="25"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="calculator-input-group">
          <label className="calculator-label">Investment Period (years):</label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={handleInvestmentPeriodChange}
            className="calculator-input"
            min="1"
            max="30"
            placeholder="10"
          />
        </div>

        {/* Cryptocurrencies Section */}
        <div className="asset-section">
          <div className="calculator-input-group">
            <label className="calculator-label">Cryptocurrencies Allocation (%):</label>
            <input
              type="number"
              value={allocations.crypto}
              onChange={(e) => handleAllocationChange(e, 'crypto')}
              className="calculator-input"
              min="0"
              max="100"
              placeholder="20"
            />
          </div>

          <div className="asset-selection">
            <div 
              className="asset-selection-header"
              onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
            >
              <h3>Select Cryptocurrencies (Max 5)</h3>
              <span className="dropdown-icon">
                {showCryptoDropdown ? '▲' : '▼'}
              </span>
            </div>
            
            {showCryptoDropdown && (
              <div className="asset-dropdown-content">
                <div className="pagination-controls">
                  <button 
                    onClick={() => handlePageChange('crypto', currentPage.crypto - 1)}
                    disabled={currentPage.crypto === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage.crypto} of {totalPages}</span>
                  <button 
                    onClick={() => handlePageChange('crypto', currentPage.crypto + 1)}
                    disabled={currentPage.crypto === totalPages}
                  >
                    Next
                  </button>
                </div>
                
                {loading.crypto ? (
                  <div className="loading-skeleton">
                    {[...Array(itemsPerPage)].map((_, i) => (
                      <div key={i} className="asset-card-skeleton"></div>
                    ))}
                  </div>
                ) : (
                  <div className="asset-grid">
                    {paginatedData(cryptoData, 'crypto').map((crypto) => (
                      <div 
                        key={crypto.id} 
                        className={`asset-card ${selectedCryptos.some(c => c.id === crypto.id) ? 'selected' : ''}`}
                        onClick={() => handleCryptoSelect(crypto)}
                      >
                        <div className="asset-header">
                          <img src={crypto.image} alt={crypto.name} width="24" />
                          <span className="asset-name">{crypto.name} ({crypto.symbol.toUpperCase()})</span>
                        </div>
                        <div className="asset-details">
                          <div className="asset-price">
                            ₹{crypto.current_price.toLocaleString()}
                          </div>
                          <div className={`asset-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </div>
                        </div>
                        <div className="asset-market-cap">
                          MCap: ₹{crypto.market_cap.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="selected-assets-container">
              {selectedCryptos.length > 0 ? (
                <div className="selected-assets-list">
                  {selectedCryptos.map(crypto => (
                    <div key={crypto.id} className="selected-asset-item">
                      <img src={crypto.image} alt={crypto.name} width="20" />
                      <span>{crypto.symbol.toUpperCase()}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCryptoSelect(crypto);
                        }}
                        className="remove-asset"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-asset-selected">
                  No cryptocurrencies selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stocks Section */}
        <div className="asset-section">
          <div className="calculator-input-group">
            <label className="calculator-label">Stocks Allocation (%):</label>
            <input
              type="number"
              value={allocations.stocks}
              onChange={(e) => handleAllocationChange(e, 'stocks')}
              className="calculator-input"
              min="0"
              max="100"
              placeholder="20"
            />
          </div>

          <div className="asset-selection">
            <div 
              className="asset-selection-header"
              onClick={() => setShowStockDropdown(!showStockDropdown)}
            >
              <h3>
                Select Stocks (Max 5) - 
                <button 
                  className="toggle-index-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUseNext50(!useNext50);
                  }}
                >
                  {useNext50 ? 'NIFTY Next 50' : 'NIFTY 50'}
                </button>
              </h3>
              <span className="dropdown-icon">
                {showStockDropdown ? '▲' : '▼'}
              </span>
            </div>
            
            {showStockDropdown && (
              <div className="asset-dropdown-content">
                <div className="pagination-controls">
                  <button 
                    onClick={() => handlePageChange('stocks', currentPage.stocks - 1)}
                    disabled={currentPage.stocks === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage.stocks} of {totalPages}</span>
                  <button 
                    onClick={() => handlePageChange('stocks', currentPage.stocks + 1)}
                    disabled={currentPage.stocks === totalPages}
                  >
                    Next
                  </button>
                </div>
                
                {loading.stocks ? (
                  <div className="loading-skeleton">
                    {[...Array(itemsPerPage)].map((_, i) => (
                      <div key={i} className="asset-card-skeleton"></div>
                    ))}
                  </div>
                ) : (
                  <div className="asset-grid">
                    {paginatedData(stockData, 'stocks').map((stock) => (
                      <div 
                        key={stock.id} 
                        className={`asset-card ${selectedStocks.some(s => s.id === stock.id) ? 'selected' : ''}`}
                        onClick={() => handleStockSelect(stock)}
                      >
                        <div className="asset-header">
                          <div className="stock-icon">{stock.symbol[0]}</div>
                          <span className="asset-name">
                            {stock.name.length > 20 
                              ? `${stock.name.substring(0, 20)}...` 
                              : stock.name
                            } ({stock.symbol})
                          </span>
                        </div>
                        <div className="asset-details">
                          <div className="asset-price">
                            ₹{stock.price?.toLocaleString('en-IN') || 'N/A'}
                          </div>
                          <div className={`asset-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                            {stock.change?.toFixed(2) || '0.00'}%
                          </div>
                        </div>
                        <div className="asset-market-cap">
                          MCap: ₹{(stock.marketCap / 10000000)?.toLocaleString('en-IN') || 'N/A'} Cr
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="selected-assets-container">
              {selectedStocks.length > 0 ? (
                <div className="selected-assets-list">
                  {selectedStocks.map(stock => (
                    <div key={stock.id} className="selected-asset-item">
                      <div className="stock-icon-small">{stock.symbol[0]}</div>
                      <span>{stock.symbol}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStockSelect(stock);
                        }}
                        className="remove-asset"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-asset-selected">
                  No stocks selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIP Section */}
        <div className="asset-section">
          <div className="calculator-input-group">
            <label className="calculator-label">SIP Allocation (%):</label>
            <input
              type="number"
              value={allocations.sip}
              onChange={(e) => handleAllocationChange(e, 'sip')}
              className="calculator-input"
              min="0"
              max="100"
              placeholder="20"
            />
          </div>

          <div className="asset-selection">
            <div 
              className="asset-selection-header"
              onClick={() => setShowSipDropdown(!showSipDropdown)}
            >
              <h3>Select SIP Funds (Max 5)</h3>
              <span className="dropdown-icon">
                {showSipDropdown ? '▲' : '▼'}
              </span>
            </div>
            
            {showSipDropdown && (
              <div className="asset-dropdown-content">
                <div className="asset-grid">
                  {sipData.map((sip) => (
                    <div 
                      key={sip.id} 
                      className={`asset-card ${selectedSips.some(s => s.id === sip.id) ? 'selected' : ''}`}
                      onClick={() => handleSipSelect(sip)}
                    >
                      <div className="asset-header">
                        <div className="sip-icon">SIP</div>
                        <span className="asset-name">{sip.name}</span>
                      </div>
                      <div className="asset-details">
                        <div className="asset-category">
                          {sip.category}
                        </div>
                        <div className="asset-returns">
                          Avg Returns: {sip.returns}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="selected-assets-container">
              {selectedSips.length > 0 ? (
                <div className="selected-assets-list">
                  {selectedSips.map(sip => (
                    <div key={sip.id} className="selected-asset-item">
                      <div className="sip-icon-small">SIP</div>
                      <span>{sip.name}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSipSelect(sip);
                        }}
                        className="remove-asset"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-asset-selected">
                  No SIP funds selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Deposit Section */}
        <div className="asset-section">
          <div className="calculator-input-group">
            <label className="calculator-label">Fixed Deposit Allocation (%):</label>
            <input
              type="number"
              value={allocations.fixedDeposit}
              onChange={(e) => handleAllocationChange(e, 'fixedDeposit')}
              className="calculator-input"
              min="0"
              max="100"
              placeholder="20"
            />
          </div>

          <div className="asset-selection">
            <div 
              className="asset-selection-header"
              onClick={() => setShowFdDropdown(!showFdDropdown)}
            >
              <h3>Select Fixed Deposit Options (Max 5)</h3>
              <span className="dropdown-icon">
                {showFdDropdown ? '▲' : '▼'}
              </span>
            </div>
            
            {showFdDropdown && (
              <div className="asset-dropdown-content">
                <div className="asset-grid">
                  {bankRates.map((bank) => (
                    <div 
                      key={bank.id} 
                      className={`asset-card ${selectedFds.some(b => b.id === bank.id) ? 'selected' : ''}`}
                      onClick={() => handleFdSelect(bank)}
                    >
                      <div className="asset-header">
                        <div className="fd-icon">FD</div>
                        <span className="asset-name">{bank.name}</span>
                      </div>
                      <div className="asset-details">
                        <div className="asset-rate">
                          Rate: {bank.regularRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="selected-assets-container">
              {selectedFds.length > 0 ? (
                <div className="selected-assets-list">
                  {selectedFds.map(fd => (
                    <div key={fd.id} className="selected-asset-item">
                      <div className="fd-icon-small">FD</div>
                      <span>{fd.name}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFdSelect(fd);
                        }}
                        className="remove-asset"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-asset-selected">
                  No FD options selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gold Allocation Input Only */}
        <div className="calculator-input-group">
          <label className="calculator-label">Gold Allocation (%):</label>
          <input
            type="number"
            value={allocations.gold}
            onChange={(e) => handleAllocationChange(e, 'gold')}
            className="calculator-input"
            min="0"
            max="100"
            placeholder="10"
          />
        </div>

        {/* Real Estate Allocation Input Only */}
        <div className="calculator-input-group">
          <label className="calculator-label">Real Estate Allocation (%):</label>
          <input
            type="number"
            value={allocations.realEstate}
            onChange={(e) => handleAllocationChange(e, 'realEstate')}
            className="calculator-input"
            min="0"
            max="100"
            placeholder="10"
          />
        </div>

        <div className="calculator-input-group">
          <label className="calculator-label">Monthly Savings Amount (₹):</label>
          <input
            type="number"
            value={savings}
            onChange={handleSavingsChange}
            className="calculator-input"
            min="0"
            step="500"
            placeholder="1000"
          />
        </div>

        <button
          onClick={calculateInvestmentPlan}
          className="calculator-button"
          disabled={!age && !savings}
        >
          Generate Investment Plan
        </button>

        {investmentPlan && summaryValues && (
          <div className="calculator-results">
            <h3 className="results-header">Your Personalized Investment Plan</h3>
            
            <div className="inflation-note">
              <TrendingUp className="inflation-icon" />
              <span>All future values adjusted for {inflationRate}% annual inflation</span>
            </div>
            
            <div className="summary-card">
              <div className="summary-item">
                <span>Investment Period:</span>
                <span>{summaryValues.years} years</span>
              </div>
              
              <div className="summary-section">
                <h4>Nominal Values (Not adjusted for inflation)</h4>
                <div className="summary-item">
                  <span>Total Investment:</span>
                  <span>₹{summaryValues.totalInvestment.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item">
                  <span>Estimated Returns:</span>
                  <span>₹{summaryValues.nominal.returns.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item highlight">
                  <span>Future Value:</span>
                  <span>₹{summaryValues.nominal.futureValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="summary-section">
                <h4>Real Values (Inflation-Adjusted)</h4>
                <div className="summary-item">
                  <span>Total Investment:</span>
                  <span>₹{summaryValues.totalInvestment.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item inflation-adjusted">
                  <span>Estimated Returns:</span>
                  <span>₹{summaryValues.real.returns.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item inflation-adjusted highlight">
                  <span>Future Value:</span>
                  <span>₹{summaryValues.real.futureValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <table className="calculator-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Allocation</th>
                  <th>Monthly Amount</th>
                  <th>Nominal Returns</th>
                  <th>Real Returns</th>
                  <th>Avg Returns</th>
                </tr>
              </thead>
              <tbody>
                {/* Cryptocurrencies Group */}
                <tr className="asset-group">
                  <td colSpan="6" className="asset-group-header">
                    Cryptocurrencies ({selectedCryptos.length})
                  </td>
                </tr>
                {investmentPlan
                  .filter(plan => plan.assetType === 'crypto')
                  .map((plan, index) => (
                    <tr key={`crypto-${index}`} className="asset-plan-row">
                      <td className="asset-plan-item">
                        <img src={plan.image} alt={plan.type} width="20" />
                        <span>{plan.type} ({plan.symbol})</span>
                      </td>
                      <td>{plan.allocation}%</td>
                      <td>₹{plan.amount}</td>
                      <td>₹{plan.nominalReturns}</td>
                      <td className="inflation-adjusted">₹{plan.realReturns}</td>
                      <td>{plan.avgReturns}% p.a.</td>
                    </tr>
                  ))
                }
                
                {/* Stocks Group */}
                <tr className="asset-group">
                  <td colSpan="6" className="asset-group-header">
                    Stocks ({selectedStocks.length})
                  </td>
                </tr>
                {investmentPlan
                  .filter(plan => plan.assetType === 'stock')
                  .map((plan, index) => (
                    <tr key={`stock-${index}`} className="asset-plan-row">
                      <td className="asset-plan-item">
                        <div className="stock-icon">{plan.symbol[0]}</div>
                        <span>{plan.type} ({plan.symbol})</span>
                      </td>
                      <td>{plan.allocation}%</td>
                      <td>₹{plan.amount}</td>
                      <td>₹{plan.nominalReturns}</td>
                      <td className="inflation-adjusted">₹{plan.realReturns}</td>
                      <td>{plan.avgReturns}% p.a.</td>
                    </tr>
                  ))
                }
                
                {/* Fixed Deposit Group */}
                <tr className="asset-group">
                  <td colSpan="6" className="asset-group-header">
                    Fixed Deposits ({selectedFds.length})
                  </td>
                </tr>
                {investmentPlan
                  .filter(plan => plan.assetType === 'fd')
                  .map((plan, index) => (
                    <tr key={`fd-${index}`} className="asset-plan-row">
                      <td className="asset-plan-item">
                        <div className="fd-icon-small">FD</div>
                        <span>{plan.type}</span>
                        {plan.bankName && <div className="bank-name">{plan.bankName}</div>}
                      </td>
                      <td>{plan.allocation}%</td>
                      <td>₹{plan.amount}</td>
                      <td>₹{plan.nominalReturns}</td>
                      <td className="inflation-adjusted">₹{plan.realReturns}</td>
                      <td>{plan.avgReturns}% p.a.</td>
                    </tr>
                  ))
                }
                
                {/* SIP Group */}
                <tr className="asset-group">
                  <td colSpan="6" className="asset-group-header">
                    SIP Funds ({selectedSips.length})
                  </td>
                </tr>
                {investmentPlan
                  .filter(plan => plan.assetType === 'sip')
                  .map((plan, index) => (
                    <tr key={`sip-${index}`} className="asset-plan-row">
                      <td className="asset-plan-item">
                        <div className="sip-icon-small">SIP</div>
                        <span>{plan.type}</span>
                      </td>
                      <td>{plan.allocation}%</td>
                      <td>₹{plan.amount}</td>
                      <td>₹{plan.nominalReturns}</td>
                      <td className="inflation-adjusted">₹{plan.realReturns}</td>
                      <td>{plan.avgReturns}% p.a.</td>
                    </tr>
                  ))
                }

                {/* Gold Group - will only appear if allocation > 0 */}
                {allocations.gold > 0 && investmentPlan.some(plan => plan.assetType === 'gold') && (
                  <>
                    <tr className="asset-group">
                      <td colSpan="6" className="asset-group-header">
                        Gold Investments
                      </td>
                    </tr>
                    {investmentPlan
                      .filter(plan => plan.assetType === 'gold')
                      .map((plan, index) => (
                        <tr key={`gold-${index}`} className="asset-plan-row">
                          <td className="asset-plan-item">
                            <div className="gold-icon-small">G</div>
                            <span>{plan.type}</span>
                          </td>
                          <td>{plan.allocation}%</td>
                          <td>₹{plan.amount}</td>
                          <td>₹{plan.nominalReturns}</td>
                          <td className="inflation-adjusted">₹{plan.realReturns}</td>
                          <td>{plan.avgReturns}% p.a.</td>
                        </tr>
                      ))
                    }
                  </>
                )}

                {/* Real Estate Group - will only appear if allocation > 0 */}
                {allocations.realEstate > 0 && investmentPlan.some(plan => plan.assetType === 'realEstate') && (
                  <>
                    <tr className="asset-group">
                      <td colSpan="6" className="asset-group-header">
                        Real Estate Investments
                      </td>
                    </tr>
                    {investmentPlan
                      .filter(plan => plan.assetType === 'realEstate')
                      .map((plan, index) => (
                        <tr key={`re-${index}`} className="asset-plan-row">
                          <td className="asset-plan-item">
                            <div className="realestate-icon-small">RE</div>
                            <span>{plan.type}</span>
                          </td>
                          <td>{plan.allocation}%</td>
                          <td>₹{plan.amount}</td>
                          <td>₹{plan.nominalReturns}</td>
                          <td className="inflation-adjusted">₹{plan.realReturns}</td>
                          <td>{plan.avgReturns}% p.a.</td>
                        </tr>
                      ))
                    }
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;