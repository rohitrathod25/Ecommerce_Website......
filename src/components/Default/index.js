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

  // Age group investment strategies
  const ageGroupStrategies = {
    "20-30": {
      name: "Aggressive Growth (20-30 years)",
      description: "High risk, high return strategy focusing on long-term growth",
      allocations: {
        crypto: "30",
        stocks: "35",
        fixedDeposit: "10",
        sip: "20",
        gold: "3",
        realEstate: "2"
      },
      recommendedCryptos: ["bitcoin", "ethereum", "cardano"],
      recommendedStocks: ["RELIANCE.NS", "TATAMOTORS.NS", "ADANIENT.NS"],
      recommendedSips: [5, 4], // Nippon India Growth Fund, SBI Small Cap Fund
      recommendedFds: [7] // Suryoday Small Finance Bank
    },
    "30-40": {
      name: "Balanced Growth (30-40 years)",
      description: "Balanced approach with moderate risk for steady growth",
      allocations: {
        crypto: "20",
        stocks: "30",
        fixedDeposit: "20",
        sip: "20",
        gold: "5",
        realEstate: "5"
      },
      recommendedCryptos: ["bitcoin", "ethereum"],
      recommendedStocks: ["RELIANCE.NS", "HDFCBANK.NS", "INFY.NS"],
      recommendedSips: [1, 3], // Axis Bluechip, Parag Parikh Flexi Cap
      recommendedFds: [7, 2] // Suryoday, HDFC Bank
    },
    "40-50": {
      name: "Conservative Growth (40-50 years)",
      description: "Lower risk with focus on capital preservation and steady returns",
      allocations: {
        crypto: "10",
        stocks: "25",
        fixedDeposit: "30",
        sip: "25",
        gold: "5",
        realEstate: "5"
      },
      recommendedCryptos: ["bitcoin"],
      recommendedStocks: ["HDFCBANK.NS", "INFY.NS", "ITC.NS"],
      recommendedSips: [1, 2], // Axis Bluechip, Mirae Asset
      recommendedFds: [2, 3] // HDFC, ICICI
    },
    "50-60": {
      name: "Income Focused (50-60 years)",
      description: "Low risk strategy focusing on income generation and capital protection",
      allocations: {
        crypto: "5",
        stocks: "20",
        fixedDeposit: "40",
        sip: "25",
        gold: "5",
        realEstate: "5"
      },
      recommendedCryptos: [],
      recommendedStocks: ["ITC.NS", "HINDUNILVR.NS", "NESTLEIND.NS"],
      recommendedSips: [1, 2], // Axis Bluechip, Mirae Asset
      recommendedFds: [1, 2, 3] // SBI, HDFC, ICICI
    },
    "60+": {
      name: "Capital Preservation (60+ years)",
      description: "Very low risk strategy focused on preserving capital and generating steady income",
      allocations: {
        crypto: "0",
        stocks: "15",
        fixedDeposit: "50",
        sip: "20",
        gold: "10",
        realEstate: "5"
      },
      recommendedCryptos: [],
      recommendedStocks: ["ITC.NS", "HINDUNILVR.NS", "NESTLEIND.NS"],
      recommendedSips: [1], // Axis Bluechip
      recommendedFds: [1, 5, 6] // SBI, PNB, Bank of Baroda
    }
  };

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
    { id: 6, name: 'Bank of Baroda', regularRate: 6.30, seniorRate: 6.80, minAmount: 1000, minTenure: 7 },
    { id: 7, name: 'Suryoday Small Finance Bank', regularRate: 7.50, seniorRate: 8.00, minAmount: 1000, minTenure: 12 },
    { id: 8, name: 'North East SF Bank', regularRate: 9, seniorRate: 9.80, minAmount: 1000, minTenure: 7 },
    { id: 9, name: 'Shivalik SF Bank', regularRate: 8.80, seniorRate: 8.80, minAmount: 1000, minTenure: 7 },
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

  // Apply age group strategy
  const applyAgeGroupStrategy = (ageGroup) => {
    const strategy = ageGroupStrategies[ageGroup];
    
    // Set allocations
    setAllocations({
      crypto: strategy.allocations.crypto,
      stocks: strategy.allocations.stocks,
      fixedDeposit: strategy.allocations.fixedDeposit,
      sip: strategy.allocations.sip,
      gold: strategy.allocations.gold,
      realEstate: strategy.allocations.realEstate
    });
    
    // Set selected cryptos
    const cryptoSelections = cryptoData.filter(crypto => 
      strategy.recommendedCryptos.includes(crypto.id)
    ).map(crypto => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      image: crypto.image
    }));
    setSelectedCryptos(cryptoSelections);
    
    // Set selected stocks
    const stockSelections = stockData.filter(stock => 
      strategy.recommendedStocks.includes(stock.id)
    ).map(stock => ({
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name
    }));
    setSelectedStocks(stockSelections);
    
    // Set selected SIPs
    const sipSelections = sipData.filter(sip => 
      strategy.recommendedSips.includes(sip.id)
    );
    setSelectedSips(sipSelections);
    
    // Set selected FDs
    const fdSelections = bankRates.filter(bank => 
      strategy.recommendedFds.includes(bank.id)
    );
    setSelectedFds(fdSelections);
    
    // Set age based on the selected group
    const minAge = parseInt(ageGroup.split('-')[0]);
    setAge(minAge.toString());
    
    // Set investment period based on age group
    let period = 10;
    if (ageGroup === "20-30") period = 15;
    else if (ageGroup === "30-40") period = 12;
    else if (ageGroup === "40-50") period = 10;
    else if (ageGroup === "50-60") period = 7;
    else period = 5;
    
    setInvestmentPeriod(period.toString());
  };

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
        
        {/* Age Group Buttons */}
        <div className="age-group-buttons">
          <h3>Select Your Age Group:</h3>
          <div className="button-group">
            {Object.keys(ageGroupStrategies).map(group => (
              <button
                key={group}
                onClick={() => applyAgeGroupStrategy(group)}
                className={`age-group-btn ${age >= parseInt(group.split('-')[0]) && 
                  (group === "60+" ? age >= 60 : age < parseInt(group.split('-')[1])) ? 'active' : ''}`}
              >
                {ageGroupStrategies[group].name}
              </button>
            ))}
          </div>
        </div>
        
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
    <h3>Select Stocks (Max 5)</h3>
    <div className="stock-type-toggle">
      <label>
        <input
          type="checkbox"
          checked={useNext50}
          onChange={() => setUseNext50(!useNext50)}
        />
        Show NIFTY Next 50
      </label>
    </div>
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
                <span className="asset-name">{stock.name} ({stock.symbol})</span>
              </div>
              <div className="asset-details">
                <div className="asset-price">
                  ₹{stock.price.toLocaleString()}
                </div>
                <div className={`asset-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change.toFixed(2)}%
                </div>
              </div>
              <div className="asset-market-cap">
                {stock.marketCap ? `MCap: ₹${(stock.marketCap / 10000000).toFixed(2)} Cr` : 'MCap: N/A'}
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

{/* SIPs Section */}
<div className="asset-section">
  <div className="calculator-input-group">
    <label className="calculator-label">SIPs Allocation (%):</label>
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
      <h3>Select SIPs (Max 5)</h3>
      <span className="dropdown-icon">
        {showSipDropdown ? '▲' : '▼'}
      </span>
    </div>
    
    {showSipDropdown && (
      <div className="asset-dropdown-content">
        <div className="sip-grid">
          {sipData.map((sip) => (
            <div 
              key={sip.id} 
              className={`asset-card ${selectedSips.some(s => s.id === sip.id) ? 'selected' : ''}`}
              onClick={() => handleSipSelect(sip)}
            >
              <div className="asset-header">
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
          No SIPs selected
        </div>
      )}
    </div>
  </div>
</div>

{/* Fixed Deposits Section */}
<div className="asset-section">
  <div className="calculator-input-group">
    <label className="calculator-label">Fixed Deposits Allocation (%):</label>
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
      <h3>Select Banks for FDs (Max 5)</h3>
      <span className="dropdown-icon">
        {showFdDropdown ? '▲' : '▼'}
      </span>
    </div>
    
    {showFdDropdown && (
      <div className="asset-dropdown-content">
        <div className="fd-grid">
          {bankRates.map((bank) => (
            <div 
              key={bank.id} 
              className={`asset-card ${selectedFds.some(b => b.id === bank.id) ? 'selected' : ''}`}
              onClick={() => handleFdSelect(bank)}
            >
              <div className="asset-header">
                <span className="asset-name">{bank.name}</span>
              </div>
              <div className="asset-details">
                <div className="fd-rate">
                  Rate: {bank.regularRate}%
                </div>
                <div className="fd-senior-rate">
                  Senior Rate: {bank.seniorRate}%
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
          {selectedFds.map(bank => (
            <div key={bank.id} className="selected-asset-item">
              <span>{bank.name}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFdSelect(bank);
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
          No banks selected for FDs
        </div>
      )}
    </div>
  </div>
</div>

{/* Gold and Real Estate Allocations */}
<div className="allocation-row">
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
</div>

{/* Monthly Savings Input */}
<div className="calculator-input-group">
  <label className="calculator-label">Monthly Savings Amount (₹):</label>
  <input
    type="number"
    value={savings}
    onChange={handleSavingsChange}
    className="calculator-input"
    min="0"
    placeholder="10000"
  />
</div>

{/* Calculate Button */}
<div className="calculate-button-container">
  <button 
    onClick={calculateInvestmentPlan}
    className="calculate-button"
    disabled={!age || !investmentPeriod || !savings}
  >
    Calculate Investment Plan
  </button>
</div>

{/* FD Projection Section */}
{showFdProjection && fdReturns && (
  <div className="fd-projection">
    <h3>FD Projection Example</h3>
    <div className="fd-projection-details">
      <p>Bank: {fdReturns.bankName}</p>
      <p>Principal: ₹{fdAmount.toLocaleString()}</p>
      <p>Tenure: {fdTenure} years</p>
      <p>Interest Rate: {fdReturns.rate}%</p>
      <p>Interest Earned: ₹{parseFloat(fdReturns.interestEarned).toLocaleString()}</p>
      <p>Maturity Amount: ₹{parseFloat(fdReturns.maturityAmount).toLocaleString()}</p>
    </div>
    <div className="fd-inputs">
      <div className="calculator-input-group">
        <label>FD Amount (₹):</label>
        <input
          type="number"
          value={fdAmount}
          onChange={(e) => setFdAmount(e.target.value)}
          min="1000"
        />
      </div>
      <div className="calculator-input-group">
        <label>Tenure (years):</label>
        <input
          type="number"
          value={fdTenure}
          onChange={(e) => setFdTenure(e.target.value)}
          min="1"
          max="10"
        />
      </div>
      <div className="calculator-input-group">
        <label>Select Bank:</label>
        <select 
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          {bankRates.map(bank => (
            <option key={bank.id} value={bank.name}>
              {bank.name} ({bank.regularRate}%)
            </option>
          ))}
        </select>
      </div>
      <button 
        onClick={calculateFdReturns}
        className="calculate-fd-button"
      >
        Recalculate FD
      </button>
    </div>
  </div>
)}

{/* Investment Plan Results */}
{investmentPlan && (
  <div className="investment-plan-results">
    <h3>Your Personalized Investment Plan</h3>
    <div className="plan-summary">
      <div className="summary-card">
        <h4>Investment Summary</h4>
        <div className="summary-row">
          <span>Current Age:</span>
          <span>{age} years</span>
        </div>
        <div className="summary-row">
          <span>Investment Period:</span>
          <span>{investmentPeriod} years</span>
        </div>
        <div className="summary-row">
          <span>Monthly Investment:</span>
          <span>₹{savings}</span>
        </div>
        <div className="summary-row">
          <span>Total Investment:</span>
          <span>₹{summaryValues.totalInvestment.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Projected Nominal Returns:</span>
          <span>₹{summaryValues.nominal.returns.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Projected Real Returns (after {inflationRate}% inflation):</span>
          <span>₹{summaryValues.real.returns.toLocaleString()}</span>
        </div>
        <div className="summary-row highlight">
          <span>Projected Nominal Future Value:</span>
          <span>₹{summaryValues.nominal.futureValue.toLocaleString()}</span>
        </div>
        <div className="summary-row highlight">
          <span>Projected Real Future Value:</span>
          <span>₹{summaryValues.real.futureValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="allocation-chart">
        <h4>Asset Allocation</h4>
        <div className="chart-container">
          {/* This would be replaced with an actual chart component */}
          <div className="pie-chart-placeholder">
            {Object.entries(allocations)
              .filter(([key, value]) => parseFloat(value) > 0)
              .map(([key, value]) => (
                <div 
                  key={key}
                  className="chart-segment"
                  style={{
                    width: `${value}%`,
                    backgroundColor: getSegmentColor(key)
                  }}
                  title={`${key}: ${value}%`}
                ></div>
              ))}
          </div>
          <div className="chart-legend">
            {Object.entries(allocations)
              .filter(([key, value]) => parseFloat(value) > 0)
              .map(([key, value]) => (
                <div key={key} className="legend-item">
                  <span 
                    className="legend-color"
                    style={{ backgroundColor: getSegmentColor(key) }}
                  ></span>
                  <span className="legend-label">{key}: {value}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>

    <div className="plan-details">
      <h4>Investment Breakdown</h4>
      <div className="plan-table-container">
        <table className="plan-table">
          <thead>
            <tr>
              <th>Asset Type</th>
              <th>Name</th>
              <th>Allocation %</th>
              <th>Monthly Amount (₹)</th>
              <th>Projected Returns (₹)</th>
              <th>Projected Future Value (₹)</th>
              <th>Real Future Value (₹)</th>
              <th>Avg Returns (%)</th>
            </tr>
          </thead>
          <tbody>
            {investmentPlan.map((item, index) => (
              <tr key={index}>
                <td className="asset-type-cell">
                  <div className="asset-type-icon">
                    {item.assetType === 'crypto' && <TrendingUp />}
                    {item.assetType === 'stock' && <TrendingUp />}
                    {item.assetType === 'sip' && <Savings />}
                    {item.assetType === 'fd' && <Savings />}
                    {item.assetType === 'gold' && '🥇'}
                    {item.assetType === 'realEstate' && '🏠'}
                  </div>
                  {item.assetType}
                </td>
                <td>
                  {item.assetType === 'crypto' && (
                    <div className="asset-with-image">
                      <img src={item.image} alt={item.type} width="20" />
                      {item.type}
                    </div>
                  )}
                  {item.assetType === 'fd' && `${item.bankName} ${item.type}`}
                  {!['crypto', 'fd'].includes(item.assetType) && item.type}
                </td>
                <td>{item.allocation}</td>
                <td>{item.amount}</td>
                <td>{item.nominalReturns}</td>
                <td>{item.nominalFutureValue}</td>
                <td>{item.realFutureValue}</td>
                <td>{item.avgReturns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="plan-notes">
      <h4>Important Notes</h4>
      <ul>
        <li>All projections are estimates based on historical averages and don't guarantee future performance.</li>
        <li>Real Future Value accounts for {inflationRate}% annual inflation.</li>
        <li>Diversification across asset classes helps reduce risk.</li>
        <li>Review and rebalance your portfolio annually.</li>
        <li>Consult with a financial advisor before making investment decisions.</li>
      </ul>
    </div>
  </div>
)}
</div>
</div>
);
};

// Helper function to get segment colors for the allocation chart
const getSegmentColor = (segment) => {
const colors = {
  crypto: '#f7931a',
  stocks: '#00b894',
  fixedDeposit: '#0984e3',
  sip: '#6c5ce7',
  gold: '#fdcb6e',
  realEstate: '#e17055'
};
return colors[segment] || '#dfe6e9';
};

export default Calculator;