import React, { useState } from 'react';

const StockEvaluator = () => {
  const [formData, setFormData] = useState({
    stockSymbol: 'AAPL',
    priceEarningsRatio: 35.2,
    earningsPerShare: 5.6,
    dividendYield: 0.65,
    marketCap: 2.3e12,
    debtToEquityRatio: 1.2,
    returnOnEquity: 0.15,
    returnOnAssets: 0.08,
    currentRatio: 1.5,
    quickRatio: 1.3,
    bookValuePerShare: 3.5,
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'stockSymbol' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/stock/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockSymbol: formData.stockSymbol,
          parameters: { ...formData }
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

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
    <div className="evaluator">
      <h2>Stock Evaluator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input name="stockSymbol" value={formData.stockSymbol} onChange={handleChange} placeholder="Stock Symbol (e.g., AAPL)" />
          <input name="priceEarningsRatio" value={formData.priceEarningsRatio} onChange={handleChange} type="number" step="any" placeholder="P/E Ratio" />
          <input name="earningsPerShare" value={formData.earningsPerShare} onChange={handleChange} type="number" step="any" placeholder="EPS" />
          <input name="dividendYield" value={formData.dividendYield} onChange={handleChange} type="number" step="any" placeholder="Dividend Yield" />
          <input name="marketCap" value={formData.marketCap} onChange={handleChange} type="number" step="any" placeholder="Market Cap" />
          <input name="debtToEquityRatio" value={formData.debtToEquityRatio} onChange={handleChange} type="number" step="any" placeholder="Debt to Equity" />
          <input name="returnOnEquity" value={formData.returnOnEquity} onChange={handleChange} type="number" step="any" placeholder="Return on Equity" />
          <input name="returnOnAssets" value={formData.returnOnAssets} onChange={handleChange} type="number" step="any" placeholder="Return on Assets" />
          <input name="currentRatio" value={formData.currentRatio} onChange={handleChange} type="number" step="any" placeholder="Current Ratio" />
          <input name="quickRatio" value={formData.quickRatio} onChange={handleChange} type="number" step="any" placeholder="Quick Ratio" />
          <input name="bookValuePerShare" value={formData.bookValuePerShare} onChange={handleChange} type="number" step="any" placeholder="Book Value Per Share" />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Stock'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {results && (
        <div className="results">
          <h3>Analysis for {results.stockSymbol}</h3>
          <div className="summary">
            <h4>Summary</h4>
            <p>{results.summary}</p>
          </div>
          <div className="feedback">
            <h4>Detailed Feedback</h4>
            <ul>
              {Object.entries(results.feedback).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockEvaluator;