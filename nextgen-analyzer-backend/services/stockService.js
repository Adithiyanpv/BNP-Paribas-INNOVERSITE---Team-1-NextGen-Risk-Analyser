// services/stockService.js

/**
 * Analyzes stock parameters based on a full set of hard-coded financial rules.
 * @param {object} params - The financial parameters of the stock.
 * @returns {object} - An object containing detailed feedback and a summary.
 */
const evaluateStockData = (params) => {
  const feedback = {};

  // Rule 4.1: Price-to-Earnings (P/E) Ratio
  const peRatio = params.priceEarningsRatio;
  if (peRatio < 15) {
    feedback.priceEarningsRatio = `The P/E ratio of ${peRatio} suggests the stock is cheap relative to earnings.`;
  } else if (peRatio <= 30) {
    feedback.priceEarningsRatio = `The P/E ratio of ${peRatio} is fairly typical.`;
  } else {
    feedback.priceEarningsRatio = `The P/E ratio of ${peRatio} indicates the stock is relatively expensive compared to its earnings.`;
  }

  // Rule 4.2: Earnings-per-Share (EPS)
  const eps = params.earningsPerShare;
  if (eps < 1) {
    feedback.earningsPerShare = `The EPS of ${eps} is low; profitability may be a concern.`;
  } else if (eps < 5) {
    feedback.earningsPerShare = `The EPS of ${eps} shows modest profitability.`;
  } else {
    feedback.earningsPerShare = `The EPS of ${eps} is a strong indicator of the company's profitability.`;
  }

  // Rule 4.3: Dividend Yield
  const dividendYield = params.dividendYield;
  if (dividendYield < 1) {
    feedback.dividendYield = `The dividend yield of ${dividendYield}% is lower than the market average.`;
  } else if (dividendYield <= 3) {
    feedback.dividendYield = `The dividend yield of ${dividendYield}% is around the market norm.`;
  } else {
    feedback.dividendYield = `The dividend yield of ${dividendYield}% is attractive for income-focused investors.`;
  }

  // Rule 4.4: Market Capitalization
  const marketCap = params.marketCap;
  const trillion = 1_000_000_000_000;
  const marketCapInTrillions = (marketCap / trillion).toFixed(2);
  if (marketCap >= 500 * trillion) {
    feedback.marketCap = `The market cap of $${marketCapInTrillions} trillion makes it one of the world's giants.`;
  } else if (marketCap >= 100 * trillion) {
    feedback.marketCap = `The market cap of $${marketCapInTrillions} trillion indicates a very large, stable company.`;
  } else {
    // Assuming value is still large enough to be expressed in trillions for this case
    feedback.marketCap = `The market capitalization of $${marketCapInTrillions} trillion indicates a sizable player.`;
  }

  // Rule 4.5: Debt-to-Equity Ratio
  const deRatio = params.debtToEquityRatio;
  if (deRatio < 0.5) {
    feedback.debtToEquityRatio = `The debt-to-equity ratio of ${deRatio} suggests very little leverage.`;
  } else if (deRatio <= 1.5) {
    feedback.debtToEquityRatio = `The debt-to-equity ratio of ${deRatio} suggests a moderate level of leverage.`;
  } else {
    feedback.debtToEquityRatio = `The debt-to-equity ratio of ${deRatio} indicates high leverage; watch for risk.`;
  }

  // Rule 4.6: Return on Equity (ROE)
  const roe = params.returnOnEquity;
  const roePct = (roe * 100).toFixed(1);
  if (roePct < 8) {
    feedback.returnOnEquity = `The ROE of ${roePct}% is below average.`;
  } else if (roePct <= 15) {
    feedback.returnOnEquity = `The ROE of ${roePct}% is healthy.`;
  } else {
    feedback.returnOnEquity = `The ROE of ${roePct}% is very strong, showing efficient profit generation.`;
  }

  // Rule 4.7: Return on Assets (ROA)
  const roa = params.returnOnAssets;
  const roaPct = (roa * 100).toFixed(1);
  if (roaPct < 5) {
    feedback.returnOnAssets = `The ROA of ${roaPct}% is modest.`;
  } else if (roaPct <= 10) {
    feedback.returnOnAssets = `The ROA of ${roaPct}% indicates efficient asset utilization.`;
  } else {
    feedback.returnOnAssets = `The ROA of ${roaPct}% is excellent, showing superb asset productivity.`;
  }

  // Rule 4.8: Current Ratio
  const currentRatio = params.currentRatio;
  if (currentRatio < 1) {
    feedback.currentRatio = `The current ratio of ${currentRatio} signals potential short-term liquidity issues.`;
  } else if (currentRatio <= 2) {
    feedback.currentRatio = `The current ratio of ${currentRatio} suggests the company has a good short-term liquidity position.`;
  } else {
    feedback.currentRatio = `The current ratio of ${currentRatio} indicates a very comfortable liquidity cushion.`;
  }

  // Rule 4.9: Quick Ratio
  const quickRatio = params.quickRatio;
  if (quickRatio < 1) {
    feedback.quickRatio = `The quick ratio of ${quickRatio} may be insufficient for immediate obligations.`;
  } else if (quickRatio <= 2) {
    feedback.quickRatio = `The quick ratio of ${quickRatio} indicates a strong ability to meet short-term obligations.`;
  } else {
    feedback.quickRatio = `The quick ratio of ${quickRatio} shows an exceptionally strong liquidity position.`;
  }

  // Rule 4.10: Book Value per Share
  const bookValuePerShare = params.bookValuePerShare;
  feedback.bookValuePerShare = `The book value per share of ${bookValuePerShare} is a measure of the company's net asset value on a per-share basis.`;

  // --- Generate Summary ---
  // Assembling the summary from the most critical feedback points, as per your logic.
  const summary_parts = [
    feedback.returnOnEquity,
    feedback.priceEarningsRatio,
    feedback.debtToEquityRatio,
    feedback.currentRatio,
  ];
  const summary = summary_parts.join(' ');

  return { feedback, summary };
};

// Export the function to be used by the controller
module.exports = {
  evaluateStockData,
};