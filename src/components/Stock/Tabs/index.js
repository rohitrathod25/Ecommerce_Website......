import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Grid from '../Grid';
import './styles.css';
import List from '../List';

export default function TabsComponent({ stocks }) { 
  // Ensure stocks is always an array
  const safeStocks = Array.isArray(stocks) ? stocks : [];

  const [value, setValue] = useState('grid');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = {
    color: "var(--white)",
    width: "50vw",
    fontSize: "1.2rem",
    fontWeight: 600,
    fontFamily: "Inter",
    textTransform: "capitalize",
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff0000",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <TabList onChange={handleChange} variant="fullWidth">
          <Tab label="Grid" value="grid" sx={style} />
          <Tab label="List" value="list" sx={style} />
        </TabList>

        <TabPanel value="grid">
          <div className="grid-flex">
            {safeStocks.length > 0 ? (
              safeStocks.map((stock, i) => <Grid stock={stock} key={i} />)
            ) : (
              <p className="no-data">No stock data available</p>
            )}
          </div>
        </TabPanel>
        <TabPanel value="list">
          <table className="list-table">
            <tbody>
              {safeStocks.length > 0 ? (
                safeStocks.map((item, i) => <List stock={item} key={i} />)
              ) : (
                <tr><td className="no-data">No stock data available</td></tr>
              )}
            </tbody>
          </table>
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
}
