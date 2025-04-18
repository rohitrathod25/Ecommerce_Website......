import React, { useState } from 'react';
import { Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { CircularProgress, Slider, Typography } from '@mui/material';
import { Savings, AccountBalance, TrendingUp, CalendarToday } from '@mui/icons-material';
import './styles.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FixedDeposit = () => {
  // Static bank data similar to StableMoney.in
  const bankRates = [
    { id: 1, name: 'State Bank of India', regularRate: 6.50, seniorRate: 7.00, minAmount: 1000, minTenure: 7 },
    { id: 2, name: 'HDFC Bank', regularRate: 6.75, seniorRate: 7.25, minAmount: 5000, minTenure: 12 },
    { id: 3, name: 'ICICI Bank', regularRate: 6.60, seniorRate: 7.10, minAmount: 10000, minTenure: 7 },
    { id: 4, name: 'Axis Bank', regularRate: 6.70, seniorRate: 7.20, minAmount: 5000, minTenure: 7 },
    { id: 5, name: 'Punjab National Bank', regularRate: 6.25, seniorRate: 6.75, minAmount: 1000, minTenure: 7 },
    { id: 6, name: 'Bank of Baroda', regularRate: 6.30, seniorRate: 6.80, minAmount: 1000, minTenure: 7 },
    { id: 7, name: 'Kotak Mahindra Bank', regularRate: 6.80, seniorRate: 7.30, minAmount: 5000, minTenure: 12 },
    { id: 8, name: 'Canara Bank', regularRate: 6.20, seniorRate: 6.70, minAmount: 1000, minTenure: 7 },
    { id: 9, name: 'IDFC First Bank', regularRate: 7.00, seniorRate: 7.50, minAmount: 5000, minTenure: 6 },
    { id: 10, name: 'Yes Bank', regularRate: 7.25, seniorRate: 7.75, minAmount: 10000, minTenure: 12 },
  ];

  // Historical FD rates for past 10 years (2014-2023)
  const historicalData = [
    { year: 2014, sbi: 8.50, hdfc: 8.75, icici: 8.60, axis: 8.70, pnb: 8.25 },
    { year: 2015, sbi: 8.25, hdfc: 8.50, icici: 8.35, axis: 8.45, pnb: 8.00 },
    { year: 2016, sbi: 7.90, hdfc: 8.15, icici: 8.00, axis: 8.10, pnb: 7.65 },
    { year: 2017, sbi: 7.50, hdfc: 7.75, icici: 7.60, axis: 7.70, pnb: 7.25 },
    { year: 2018, sbi: 7.30, hdfc: 7.55, icici: 7.40, axis: 7.50, pnb: 7.05 },
    { year: 2019, sbi: 6.85, hdfc: 7.10, icici: 6.95, axis: 7.05, pnb: 6.60 },
    { year: 2020, sbi: 6.50, hdfc: 6.75, icici: 6.60, axis: 6.70, pnb: 6.25 },
    { year: 2021, sbi: 6.40, hdfc: 6.65, icici: 6.50, axis: 6.60, pnb: 6.15 },
    { year: 2022, sbi: 6.50, hdfc: 6.75, icici: 6.60, axis: 6.70, pnb: 6.25 },
    { year: 2023, sbi: 6.50, hdfc: 6.75, icici: 6.60, axis: 6.70, pnb: 6.25 },
    { year: 2024, sbi: 6.50, hdfc: 6.75, icici: 6.60, axis: 6.70, pnb: 6.25 },
  ];

  const [formData, setFormData] = useState({
    amount: 100000,
    tenure: 12,
    payout: 'maturity',
    seniorCitizen: false,
    selectedBank: 'State Bank of India'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSliderChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateFD = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      try {
        const { amount, tenure, payout, seniorCitizen, selectedBank } = formData;
        const bank = bankRates.find(b => b.name === selectedBank) || bankRates[0];
        
        const rate = seniorCitizen ? bank.seniorRate : bank.regularRate;
        const years = tenure / 12;
        let interestEarned, maturityAmount;

        if (payout === 'maturity') {
          interestEarned = amount * Math.pow(1 + rate / 100, years) - amount;
          maturityAmount = amount + interestEarned;
        } else {
          interestEarned = (amount * rate * years) / 100;
          maturityAmount = amount + interestEarned;
        }

        setResults({
          investment: amount,
          tenure,
          rate,
          maturityAmount: Number(maturityAmount).toFixed(2),
          interestEarned: Number(interestEarned).toFixed(2),
          bankName: bank.name,
          payoutFrequency: payout
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  // Sort banks by best rate
  const sortedBanks = [...bankRates].sort((a, b) => 
    (formData.seniorCitizen ? b.seniorRate - a.seniorRate : b.regularRate - a.regularRate)
  );

  // Prepare chart data
  const chartData = historicalData.map(yearData => ({
    year: yearData.year,
    'SBI': yearData.sbi,
    'HDFC': yearData.hdfc,
    'ICICI': yearData.icici,
    'Axis': yearData.axis,
    'PNB': yearData.pnb
  }));

  return (
    <div className="fixed-deposit-container">
      <h2 className="page-title">
        <AccountBalance className="icon" /> Fixed Deposit Calculator
      </h2>
      <p className="page-subtitle">Compare FD rates across top Indian banks</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="fd-calculator-section">
        <Card className="calculator-card">
          <Card.Header className="calculator-header">
            <Savings className="icon" /> FD Calculator
          </Card.Header>
          <Card.Body>
            <Form onSubmit={calculateFD}>
              <Form.Group className="mb-3">
                <Form.Label>Investment Amount (₹)</Form.Label>
                <Slider
                  value={formData.amount}
                  onChange={(e, value) => handleSliderChange('amount', value)}
                  min={1000}
                  max={1000000}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                />
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1000"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tenure (months)</Form.Label>
                <Slider
                  value={formData.tenure}
                  onChange={(e, value) => handleSliderChange('tenure', value)}
                  min={1}
                  max={120}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} months`}
                />
                <Form.Control
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Interest Payout Frequency</Form.Label>
                <Form.Select
                  name="payout"
                  value={formData.payout}
                  onChange={handleInputChange}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="annually">Annually</option>
                  <option value="maturity">At Maturity</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Bank</Form.Label>
                <Form.Select
                  name="selectedBank"
                  value={formData.selectedBank}
                  onChange={handleInputChange}
                >
                  {sortedBanks.map(bank => (
                    <option key={bank.id} value={bank.name}>
                      {bank.name} ({formData.seniorCitizen ? bank.seniorRate : bank.regularRate}%)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  name="seniorCitizen"
                  label="Senior Citizen (Higher Rates)"
                  checked={formData.seniorCitizen}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" className="me-2" />
                    Calculating...
                  </>
                ) : 'Calculate Returns'}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {results && (
          <Card className="results-card">
            <Card.Header className="results-header">
              <TrendingUp className="icon" /> Your FD Returns
            </Card.Header>
            <Card.Body>
              <div className="bank-info">
                <div className="bank-name">{results.bankName}</div>
                <div className="interest-rate">
                  {results.rate}% {formData.seniorCitizen ? '(Senior Citizen)' : '(Regular)'}
                </div>
              </div>
              
              <div className="maturity-amount">
                <div className="label">Maturity Amount</div>
                <div className="value">₹{results.maturityAmount}</div>
              </div>

              <Table borderless className="results-details">
                <tbody>
                  <tr>
                    <td>Principal Amount</td>
                    <td>₹{results.investment}</td>
                  </tr>
                  <tr>
                    <td>Interest Earned</td>
                    <td>₹{results.interestEarned}</td>
                  </tr>
                  <tr>
                    <td>Tenure</td>
                    <td>{results.tenure} months</td>
                  </tr>
                  <tr>
                    <td>Payout Frequency</td>
                    <td>{results.payoutFrequency}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </div>

      <div className="bank-rates-section">
        <Card>
          <Card.Header className="rates-header">
            <AccountBalance className="icon" /> Current FD Rates in India
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover className="bank-rates-table">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Regular Rate</th>
                    <th>Senior Citizen Rate</th>
                    <th>Min Amount</th>
                    <th>Min Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBanks.map((bank) => (
                    <tr 
                      key={bank.id} 
                      className={formData.selectedBank === bank.name ? 'selected-bank' : ''}
                      onClick={() => setFormData({...formData, selectedBank: bank.name})}
                    >
                      <td>{bank.name}</td>
                      <td>{bank.regularRate}%</td>
                      <td>{bank.seniorRate}%</td>
                      <td>₹{bank.minAmount.toLocaleString()}</td>
                      <td>{bank.minTenure} days</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="disclaimer">
              <p>Rates are indicative and subject to change. Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="historical-rates-section mt-5">
        <Card>
          <Card.Header className="rates-header">
            <CalendarToday className="icon" /> Historical FD Rates (2014-2023)
            <Button 
              variant="link" 
              onClick={() => setShowChart(!showChart)}
              className="float-end"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
          </Card.Header>
          <Card.Body>
            {showChart && (
              <div className="chart-container" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[5, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="SBI" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="HDFC" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="ICICI" stroke="#ffc658" />
                    <Line type="monotone" dataKey="Axis" stroke="#ff8042" />
                    <Line type="monotone" dataKey="PNB" stroke="#0088FE" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>SBI</th>
                  <th>HDFC</th>
                  <th>ICICI</th>
                  <th>Axis</th>
                  <th>PNB</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.year}</td>
                    <td>{data.sbi}%</td>
                    <td>{data.hdfc}%</td>
                    <td>{data.icici}%</td>
                    <td>{data.axis}%</td>
                    <td>{data.pnb}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      <div className="fd-info-section">
        <Card>
          <Card.Header className="info-header">
            <CalendarToday className="icon" /> FD Information
          </Card.Header>
          <Card.Body>
            <div className="info-content">
              <h5>Current FD Rate Trends (2023)</h5>
              <ul>
                <li>Highest regular FD rate: 7.25% (Yes Bank)</li>
                <li>Highest senior citizen rate: 7.75% (Yes Bank)</li>
                <li>Average 1-year FD rate: 6.5% across banks</li>
              </ul>

              <h5>Best FD Options</h5>
              <div className="best-options">
                <div className="option">
                  <div className="title">Highest Returns</div>
                  <div className="bank">Yes Bank (7.25%)</div>
                </div>
                <div className="option">
                  <div className="title">Best Large Bank</div>
                  <div className="bank">HDFC Bank (6.75%)</div>
                </div>
                <div className="option">
                  <div className="title">Best Public Sector</div>
                  <div className="bank">SBI (6.50%)</div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default FixedDeposit;