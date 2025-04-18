import * as React from "react";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <MenuIcon />
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          <Link to="/" onClick={() => setOpen(false)}>
            <p className="link">Home</p>
          </Link>
          <Link to="/watchlist" onClick={() => setOpen(false)}>
            <p className="link">Watchlist</p>
          </Link>
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <p className="link">Dashboard</p>
          </Link>
          <Link to="/stock" onClick={() => setOpen(false)}>
            <p className="link">Stock</p>
          </Link>
          <Link to="/fixeddeposit" onClick={() => setOpen(false)}>
            <p className="link">Fixed Deposit</p>
          </Link>
          <Link to="/sip" onClick={() => setOpen(false)}>
            <p className="link">SIP</p>
          </Link>
          <Link to="/calculator" onClick={() => setOpen(false)}>
            <p className="link">Calculator</p>
          </Link>
          <Link to="/default" onClick={() => setOpen(false)}>
            <p className="link">Default</p>
          </Link>

        </div>
      </Drawer>
    </div>
  );
}
