// src/components/Layout.js
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/">FinAnalyzer</Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/stock-analysis">Stock Analysis</Link>
          <Link to="/portfolio-analysis">Portfolio Analysis</Link>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;