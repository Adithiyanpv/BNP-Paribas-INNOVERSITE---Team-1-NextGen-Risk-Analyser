import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const parseKeyValueString = (str) => {
  if (!str) return {};
  return str.split(',').reduce((acc, curr) => {
    const [key, value] = curr.split(':');
    if (key && value) {
      acc[key.trim().toUpperCase()] = parseFloat(value.trim());
    }
    return acc;
  }, {});
};

const PortfolioAnalyzer = () => {
  const [funds, setFunds] = useState([
    { fundCode: 'FUND_A', amount: 1000000, holdingsStr: 'INFY:0.3, HDFCBANK:0.5, ITC:0.2', sectorsStr: 'IT:0.3, Banking:0.5, FMCG:0.2' },
    { fundCode: 'FUND_B', amount: 1000000, holdingsStr: 'INFY:0.4, RELIANCE:0.3, HDFCBANK:0.3', sectorsStr: 'IT:0.4, Energy:0.3, Banking:0.3' },
  ]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddFund = () => setFunds([...funds, { fundCode: '', amount: 0, holdingsStr: '', sectorsStr: '' }]);
  const handleRemoveFund = (index) => setFunds(funds.filter((_, i) => i !== index));
  const handleFundChange = (index, event) => {
    const newFunds = [...funds];
    const { name, value } = event.target;
    newFunds[index][name] = name === 'amount' ? parseInt(value) || 0 : value;
    setFunds(newFunds);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults(null);
    const payload = funds.map(fund => ({
      fundCode: fund.fundCode, amount: fund.amount,
      holdings: parseKeyValueString(fund.holdingsStr), sectors: parseKeyValueString(fund.sectorsStr),
    }));
    try {
      const response = await fetch('http://localhost:5000/api/portfolio/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funds: payload }),
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || 'Network response was not ok');}
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch analysis. Please ensure the backend server is running and tickers are valid.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    if (!results) return {};
    const sectors = results.portfolioAnalysis.sectorDiversification;
    const performance = results.portfolioAnalysis.performance;
    const sectorChartData = {
      labels: Object.keys(sectors),
      datasets: [{
        label: 'Sector Weight', data: Object.values(sectors),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26A69A', '#AB47BC', '#78909C'],
        borderColor: '#fff', borderWidth: 2,
      }],
    };
    const performanceChartData = {
      labels: ['1-Year Return', '3-Year Return', '5-Year Return'],
      datasets: [{
        label: 'Return (%)',
        data: [performance.oneYearReturn, performance.threeYearReturn, performance.fiveYearReturn],
        backgroundColor: '#66BB6A',
      }],
    };
    return { sectorChartData, performanceChartData };
  };

  const { sectorChartData, performanceChartData } = getChartData();
  const getRiskClass = (riskLevel) => {
    const level = riskLevel?.toLowerCase() || '';
    if (level.includes('high')) return 'risk-high';
    if (level.includes('moderate')) return 'risk-moderate';
    return 'risk-low';
  };

  return (
    <div className="analyzer-container">
      <h2>Portfolio Analyzer</h2>
      {/* --- THIS IS THE FORM TO ADD DATA --- */}
      <form onSubmit={handleSubmit}>
        {funds.map((fund, index) => (
          <div key={index} className="fund-card">
            <h4>Fund {index + 1}</h4>
            <input name="fundCode" value={fund.fundCode} onChange={e => handleFundChange(index, e)} placeholder="Fund Code" />
            <input name="amount" value={fund.amount} onChange={e => handleFundChange(index, e)} type="number" placeholder="Amount" />
            <textarea name="holdingsStr" value={fund.holdingsStr} onChange={e => handleFundChange(index, e)} placeholder="Holdings (e.g., INFY:0.3, ITC:0.2)" />
            <textarea name="sectorsStr" value={fund.sectorsStr} onChange={e => handleFundChange(index, e)} placeholder="Sectors (e.g., IT:0.5, FMCG:0.5)" />
            <button type="button" className="remove-btn" onClick={() => handleRemoveFund(index)}>Remove</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddFund}>Add Another Fund</button>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Analyze Portfolio'}</button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* --- RESULTS AND VISUALS (Only shown AFTER clicking 'Analyze') --- */}
      {results && (
        <div className="results">
          <h3>Portfolio Analysis Results</h3>
          <div className="summary-card">
            <h4>Analyst Summary</h4>
            <p><strong>{results.summary}</strong></p>
          </div>
          <div className="results-grid">
            <div>
              <h4>Key Metrics</h4>
              <p><strong>Investor Profile:</strong> {results.traderType}</p>
              <div className="risk-metric"><strong>Risk Level:</strong> <span className={`risk-indicator ${getRiskClass(results.portfolioAnalysis.riskLevel)}`}>{results.portfolioAnalysis.riskLevel}</span></div>
              <p><strong>Total Value:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(results.portfolioAnalysis.totalValue)}</p>
            </div>
            <div className="chart-container">
               <Doughnut data={sectorChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Sector Diversification' } } }}/>
            </div>
          </div>
          <div className="chart-container performance-chart">
            <Bar data={performanceChartData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Portfolio Performance (%)' } } }}/>
          </div>
          <div className="recommendations">
            <h4>Diversification Recommendations</h4>
            <ul>
              {results.possibleDiversification.map((item, index) => (
                <li key={index}><strong>{item.sector}:</strong> {item.recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalyzer;