// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StockAnalysisPage from './pages/StockAnalysisPage';
import PortfolioAnalysisPage from './pages/PortfolioAnalysisPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stock-analysis" element={<StockAnalysisPage />} />
          <Route path="portfolio-analysis" element={<PortfolioAnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;