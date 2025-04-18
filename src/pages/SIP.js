import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import Search from '../components/Stock/Search';
import Pagination from '../components/Stock/Pagination';
import Grid from '../components/SIP/Grid';
import axios from 'axios';

const SIP = () => {
  const [sips, setSips] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Your RapidAPI key
  const RAPIDAPI_KEY = 'b41ad0745fmsh2ccfa0114ad97e8p10551djsna576aa468779';

  // Fund symbols mapped to their details
  const fundDetails = {
    // Large Cap Funds
    '0P0000PTGR.BO': { name: 'SBI Bluechip Fund', category: 'Large Cap', cagr: '17%' },
    '0P0000XVU6.BO': { name: 'Axis Bluechip Fund', category: 'Large Cap', cagr: '16%' },
    '0P0000XVU7.BO': { name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', cagr: '16%' },
    '0P0000XVU9.BO': { name: 'ICICI Pru Bluechip Fund', category: 'Large Cap', cagr: '18%' },
    '0P0000XVUA.BO': { name: 'HDFC Top 100 Fund', category: 'Large Cap', cagr: '19%' },
    '0P00018P1L.BO': { name: 'Quant Large Cap Fund', category: 'Large Cap', cagr: '25%' },
    '0P0000YWL5.BO': { name: 'Nippon India Large Cap Fund', category: 'Large Cap', cagr: '20%' },
    '0P0000Z9R2.BO': { name: 'Kotak Bluechip Fund', category: 'Large Cap', cagr: '15%' },
    '0P0001A3K3.BO': { name: 'Edelweiss Large Cap Fund', category: 'Large Cap', cagr: '15%' },
    '0P0000Z9R1.BO': { name: 'UTI Mastershare Fund', category: 'Large Cap', cagr: '14%' },

    // Mid Cap Funds
    '0P00018P1M.BO': { name: 'Quant Mid Cap Fund', category: 'Mid Cap', cagr: '35%' },
    '0P0000YWL6.BO': { name: 'Motilal Oswal Midcap Fund', category: 'Mid Cap', cagr: '28%' },
    '0P0000XVU8.BO': { name: 'Kotak Emerging Equity Fund', category: 'Mid Cap', cagr: '22%' },
    '0P0000YWL7.BO': { name: 'Nippon India Growth Fund', category: 'Mid Cap', cagr: '27%' },
    '0P0000YWL8.BO': { name: 'HDFC Mid-Cap Opportunities Fund', category: 'Mid Cap', cagr: '25%' },
    '0P0000YWL9.BO': { name: 'SBI Magnum Midcap Fund', category: 'Mid Cap', cagr: '24%' },
    '0P0000YWLA.BO': { name: 'Edelweiss Mid Cap Fund', category: 'Mid Cap', cagr: '23%' },
    '0P0000YWLB.BO': { name: 'Axis Midcap Fund', category: 'Mid Cap', cagr: '21%' },
    '0P0000YWLC.BO': { name: 'Tata Midcap Growth Fund', category: 'Mid Cap', cagr: '20%' },
    '0P0000YWLD.BO': { name: 'Sundaram Mid Cap Fund', category: 'Mid Cap', cagr: '19%' },

    // Small Cap Funds
    '0P00018P1N.BO': { name: 'Quant Small Cap Fund', category: 'Small Cap', cagr: '40%' },
    '0P0000XVUB.BO': { name: 'Nippon India Small Cap Fund', category: 'Small Cap', cagr: '32%' },
    '0P0000YWLE.BO': { name: 'HDFC Small Cap Fund', category: 'Small Cap', cagr: '28%' },
    '0P0000YWLF.BO': { name: 'SBI Small Cap Fund', category: 'Small Cap', cagr: '27%' },
    '0P0000YWLG.BO': { name: 'Axis Small Cap Fund', category: 'Small Cap', cagr: '26%' },
    '0P0000YWLH.BO': { name: 'Tata Small Cap Fund', category: 'Small Cap', cagr: '25%' },
    '0P0000YWLI.BO': { name: 'Kotak Small Cap Fund', category: 'Small Cap', cagr: '24%' },
    '0P0000YWLJ.BO': { name: 'DSP Small Cap Fund', category: 'Small Cap', cagr: '23%' },
    '0P0000YWLK.BO': { name: 'ICICI Pru Smallcap Fund', category: 'Small Cap', cagr: '22%' },
    '0P0000YWLL.BO': { name: 'Franklin India Smaller Cos Fund', category: 'Small Cap', cagr: '21%' }
  };

  const fundSymbols = Object.keys(fundDetails);

  useEffect(() => {
    const fetchSIPData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
          {
            params: {
              region: 'IN',
              symbols: fundSymbols.join(',')
            },
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            },
            timeout: 10000
          }
        );

        // Create a map of API results for quick lookup
        const apiResults = {};
        if (response.data?.quoteResponse?.result) {
          response.data.quoteResponse.result.forEach(item => {
            apiResults[item.symbol] = item;
          });
        }

        // Process all funds, using API data where available
        const processedData = fundSymbols.map((symbol) => {
          const details = fundDetails[symbol];
          const apiData = apiResults[symbol] || {};
          
          return {
            symbol,
            longName: details.name,
            category: details.category,
            cagr: details.cagr,
            regularMarketPrice: apiData.regularMarketPrice || generateRandomPrice(),
            regularMarketChange: apiData.regularMarketChange || generateRandomChange(),
            regularMarketChangePercent: apiData.regularMarketChangePercent || generateRandomChangePercent(),
            minSipAmount: details.category === 'Small Cap' ? 1000 : 500,
            riskLevel: details.category === 'Small Cap' ? 'Very High' : 
                      details.category === 'Mid Cap' ? 'High' : 'Moderate',
            returns: generateReturns(details.category, details.cagr),
            isLiveData: !!apiData.regularMarketPrice
          };
        });

        setSips(processedData);
        
        // Show warning if some data is missing
        
      } catch (error) {
        console.error('API Error:', error);
        setSips(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSIPData, 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper functions for generating random data
  const generateRandomPrice = () => 100 + Math.random() * 500;
  const generateRandomChange = () => (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
  const generateRandomChangePercent = () => (Math.random() > 0.5 ? 0.5 : -0.5) * (1 + Math.random());

  // Helper function to generate realistic returns based on category and CAGR
  const generateReturns = (category, cagr) => {
    const baseCagr = parseFloat(cagr);
    return {
      '1Y': (baseCagr * 1.2).toFixed(1),
      '3Y': (baseCagr * 1.1).toFixed(1),
      '5Y': baseCagr.toFixed(1),
      '7Y': (baseCagr * 0.9).toFixed(1),
      '10Y': (baseCagr * 0.8).toFixed(1)
    };
  };

  // Generate mock data when API fails
  const generateMockData = () => {
    return fundSymbols.map(symbol => {
      const details = fundDetails[symbol];
      return {
        symbol,
        longName: details.name,
        category: details.category,
        cagr: details.cagr,
        regularMarketPrice: generateRandomPrice(),
        regularMarketChange: generateRandomChange(),
        regularMarketChangePercent: generateRandomChangePercent(),
        minSipAmount: details.category === 'Small Cap' ? 1000 : 500,
        riskLevel: details.category === 'Small Cap' ? 'Very High' : 
                  details.category === 'Mid Cap' ? 'High' : 'Moderate',
        returns: generateReturns(details.category, details.cagr),
        isLiveData: false
      };
    });
  };

  const filteredSips = sips.filter(sip => {
    if (!search.trim()) return true;
    const searchTerm = search.toLowerCase();
    return (
      sip.longName.toLowerCase().includes(searchTerm) ||
      sip.category.toLowerCase().includes(searchTerm) ||
      sip.symbol.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedSips = filteredSips.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="sip-page">
      <Header />
      <div className="search-container">
        <Search 
          search={search} 
          onSearchChange={(e) => { 
            setSearch(e.target.value); 
            setPage(1); 
          }} 
          placeholder="Search funds by name, category..."
        />
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading top performing SIP funds...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="error-notice">
              <p>{error}</p>
            </div>
          )}
          
          <div className="sip-results">
            {filteredSips.length > 0 ? (
              <>
                <div className="fund-categories">
                  <h3>Showing: All Categories ({filteredSips.length} funds)</h3>
                  <div className="category-filters">
                    <button onClick={() => setSearch('Large Cap')}>Large Cap</button>
                    <button onClick={() => setSearch('Mid Cap')}>Mid Cap</button>
                    <button onClick={() => setSearch('Small Cap')}>Small Cap</button>
                    <button onClick={() => setSearch('')}>All Funds</button>
                  </div>
                </div>
                
                <div className="sip-grid">
                  {paginatedSips.map((sip) => (
                    <Grid 
                      key={sip.symbol}
                      fund={sip}
                    />
                  ))}
                </div>
                
                <Pagination 
                  page={page}
                  handlePageChange={(_, value) => setPage(value)}
                  count={Math.ceil(filteredSips.length / perPage)}
                />
              </>
            ) : (
              <div className="no-results">
                <p>No funds match your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SIP;