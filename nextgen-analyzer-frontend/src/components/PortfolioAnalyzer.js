import React, { useState } from 'react';

// A helper function to parse strings like "INFY:0.3, HDFCBANK:0.5" into an object
const parseKeyValueString = (str) => {
  if (!str) return {};
  return str.split(',').reduce((acc, curr) => {
    const [key, value] = curr.split(':');
    if (key && value) {
      acc[key.trim()] = parseFloat(value.trim());
    }
    return acc;
  }, {});
};

const PortfolioAnalyzer = () => {
  const [funds, setFunds] = useState([
    { fundCode: 'FUND_A', amount: 1000000, holdingsStr: 'INFY:0.3, HDFCBANK:0.5, ITC:0.2', sectorsStr: 'IT:0.3, Banking:0.5, FMCG:0.2' },
  ]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddFund = () => {
    setFunds([...funds, { fundCode: '', amount: 0, holdingsStr: '', sectorsStr: '' }]);
  };

  const handleRemoveFund = (index) => {
    const newFunds = funds.filter((_, i) => i !== index);
    setFunds(newFunds);
  };

  const handleFundChange = (index, event) => {
    const newFunds = [...funds];
    newFunds[index][event.target.name] = event.target.name === 'amount' ? parseInt(event.target.value) : event.target.value;
    setFunds(newFunds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults(null);

    const payload = funds.map(fund => ({
      fundCode: fund.fundCode,
      amount: fund.amount,
      holdings: parseKeyValueString(fund.holdingsStr),
      sectors: parseKeyValueString(fund.sectorsStr),
    }));

    try {
      const response = await fetch('http://localhost:5000/api/portfolio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funds: payload }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch analysis. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analyzer-container">
      <h2>Portfolio Analyzer</h2>
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

      {results && (
        <div className="results">
          <h3>Portfolio Analysis Results</h3>
          <p><strong>Final Diversification Score: {results.finalDiversificationScore} / 100</strong></p>
          <div className="results-grid">
            <div>
              <h4>Fund Overlap</h4>
              <p>Average Overlap: {results.fundOverlap.averageOverlapPercentage}%</p>
              <p>Overlap Score: {results.fundOverlap.overlapScore}</p>
            </div>
            <div>
              <h4>Sector Diversification</h4>
              <p>Sector Score: {results.sectorDiversification.sectorScore}</p>
              <ul>
                {Object.entries(results.sectorDiversification.weightedExposures).map(([sector, weight]) => (
                  <li key={sector}>{sector}: {weight}%</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalyzer;