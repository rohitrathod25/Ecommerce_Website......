import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import TabsComponent from '../components/DashBoard/Tabs';
import axios from 'axios';
import Search from '../components/DashBoard/Search';
import PaginationComponent from '../components/DashBoard/Pagination';
import Loader from '../components/Common/Loader';
import BackToTop from '../components/Common/BackToTop';

function DashboardPage() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10; // Number of coins per page
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  useEffect(() => { 
    axios
      .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then((response) => {
        setCoins(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ERROR>>>", error);
        setIsLoading(false);
      });
  }, []);

  // Filter coins based on search
  const filteredCoins = coins.filter(
    (item) => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered coins
  const paginatedCoins = filteredCoins.slice((page - 1) * perPage, page * perPage);

  return (
    <>
    <Header />
    <BackToTop/>
    { isLoading?(
    <Loader/>
    ):(
    <div>
      <Search search={search} onSearchChange={onSearchChange} />
      <TabsComponent coins={paginatedCoins} />
      <PaginationComponent page={page} handlePageChange={handlePageChange} count={Math.ceil(filteredCoins.length / perPage)} />
    </div>
    )}
    </>
  );
}

export default DashboardPage;
