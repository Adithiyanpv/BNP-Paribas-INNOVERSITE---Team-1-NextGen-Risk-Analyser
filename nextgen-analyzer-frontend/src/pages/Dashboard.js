// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <section className="hero">
        <h1>Professional Financial Analysis</h1>
        <p>Analyze stocks and portfolios with advanced metrics and insights. Make informed investment decisions with our comprehensive evaluation tools.</p>
        <div className="hero-buttons">
          <Link to="/stock-analysis" className="btn btn-primary">Analyze Stocks</Link>
          <Link to="/portfolio-analysis" className="btn btn-secondary">Portfolio Analysis</Link>
        </div>
      </section>

      <section className="tools-section">
        <h2>Powerful Analysis Tools</h2>
        <div className="tool-cards">
          <Link to="/stock-analysis" className="card">
            <h3>Stock Evaluation</h3>
            <p>Comprehensive fundamental analysis</p>
          </Link>
          <Link to="/portfolio-analysis" className="card">
            <h3>Portfolio Analysis</h3>
            <p>Diversification and overlap insights</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;