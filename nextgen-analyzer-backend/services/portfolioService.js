// services/portfolioService.js

/**
 * Analyzes a portfolio for fund overlap and sector diversification.
 * @param {Array} funds - An array of fund objects from the request body.
 * @returns {object} - A detailed analysis of the portfolio's diversification.
 */
const analyzePortfolioData = (funds) => {
  // --- Step 1: Calculate Fund Overlap ---

  // Helper to get all unique stock tickers from all funds
  const allHoldings = new Set();
  funds.forEach(fund => {
    Object.keys(fund.holdings).forEach(ticker => allHoldings.add(ticker));
  });

  // Calculate pairwise overlaps
  const pairwiseOverlaps = [];
  // A simple way to get all unique pairs of funds (e.g., A&B, A&C, B&C)
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const fund1 = funds[i];
      const fund2 = funds[j];
      let overlapSum = 0;

      allHoldings.forEach(stock => {
        const weight1 = fund1.holdings[stock] || 0;
        const weight2 = fund2.holdings[stock] || 0;
        overlapSum += Math.min(weight1, weight2);
      });
      pairwiseOverlaps.push(overlapSum);
    }
  }

  const averageOverlap = pairwiseOverlaps.length > 0
    ? pairwiseOverlaps.reduce((sum, val) => sum + val, 0) / pairwiseOverlaps.length
    : 0;
  
  const overlapScore = (1 - averageOverlap) * 100;

  // --- Step 2: Calculate Sector Diversification ---

  const totalPortfolioValue = funds.reduce((sum, fund) => sum + fund.amount, 0);

  // Calculate each fund's weight in the total portfolio
  funds.forEach(fund => {
    fund.share = fund.amount / totalPortfolioValue;
  });

  // Get all unique sectors
  const allSectors = new Set();
  funds.forEach(fund => {
    Object.keys(fund.sectors).forEach(sector => allSectors.add(sector));
  });

  // Calculate weighted sector exposures
  const weightedSectorExposures = {};
  allSectors.forEach(sector => {
    let totalSectorWeight = 0;
    funds.forEach(fund => {
      const sectorWeightInFund = fund.sectors[sector] || 0;
      totalSectorWeight += fund.share * sectorWeightInFund;
    });
    weightedSectorExposures[sector] = totalSectorWeight;
  });
  
  // Compute Herfindahl-Hirschman Index (HHI)
  const hhi = Object.values(weightedSectorExposures).reduce((sum, weight) => sum + weight ** 2, 0);
  const sectorScore = (1 - hhi) * 100;
  
  // --- Step 3: Calculate Final Diversification Score ---
  const finalDiversificationScore = 0.5 * overlapScore + 0.5 * sectorScore;

  // Format the weighted exposures for the response
  const formattedExposures = {};
  for (const [sector, weight] of Object.entries(weightedSectorExposures)) {
    formattedExposures[sector] = parseFloat((weight * 100).toFixed(2));
  }

  return {
    totalPortfolioValue,
    fundOverlap: {
      averageOverlapPercentage: parseFloat((averageOverlap * 100).toFixed(2)),
      overlapScore: parseFloat(overlapScore.toFixed(2)),
    },
    sectorDiversification: {
      weightedExposures: formattedExposures,
      hhi: parseFloat(hhi.toFixed(4)),
      sectorScore: parseFloat(sectorScore.toFixed(2)),
    },
    finalDiversificationScore: parseFloat(finalDiversificationScore.toFixed(2)),
  };
};

module.exports = {
  analyzePortfolioData,
};