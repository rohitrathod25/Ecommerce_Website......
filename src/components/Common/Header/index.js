import React from "react";
import "./styles.css";
import TemporaryDrawer from "./drawer";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); // ✅ Use navigate for proper redirection

  return (
    <div className="navbar">
      <h1 className="logo">
        InvestmentTracker<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <div className="links">
        <Link to="/">
          <p className="link">Home</p>
        </Link>
        <Link to="/watchlist">
          <p className="link">Watchlist</p>
        </Link>
        <Button text="Dashboard" onClick={() => navigate("/dashboard")} />
        <Button text="Stock" onClick={() => navigate("/stock")} />
        <Button text="Fixed Deposit" onClick={() => navigate("/fixeddeposit")} />
        <Button text="SIP" onClick={() => navigate("/sip")} />
        <Button text="Calculator" onClick={() => navigate("/calculator")} />
        <Button text="Default" onClick={() => navigate("/default")} />
       
      </div>
      <div className="mobile-drawer">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
