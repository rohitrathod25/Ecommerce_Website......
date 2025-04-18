import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import WatchlistPage from "./pages/Watchlist";
import StockPage from "./pages/Stock";
import CoinPage from "./pages/Coin";
import FixedDepositPage from "./pages/FixedDeposit"; // Corrected import
import SIPPage from "./pages/SIP";
import Calculator from "./components/Calculator";
import Default from "./components/Default";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/coin/:id" element={<CoinPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/fixeddeposit" element={<FixedDepositPage />} />
          <Route path="/sip" element={<SIPPage />} />
          <Route path="/calculator" element={<Calculator/>} />
          <Route path="/default" element={<Default/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;