// services/portfolioService.js
const yahooFinance = require('yahoo-finance2').default;

// --- generateQualitativeReport function remains the same ---
function generateQualitativeReport(quantitativeData) {
  const { totalPortfolioValue, sectorDiversification, performance } = quantitativeData;
  const exposures = sectorDiversification.weightedExposures;
  
  let riskLevel = 'Low';
  let traderType = 'Balanced Investor';
  let summaryParts = [];

  const growthSectors = ['it', 'technology', 'energy'];
  let growthSectorWeight = 0;
  const sortedSectors = Object.entries(exposures).sort(([,a],[,b]) => b-a);
  
  sortedSectors.forEach(([sector, weight]) => {
    if (growthSectors.includes(sector.toLowerCase())) {
      growthSectorWeight += weight;
    }
  });

  if (growthSectorWeight >= 50) {
    riskLevel = 'High';
    traderType = 'Growth Investor';
    summaryParts.push(`Your portfolio is heavily concentrated in growth sectors like ${sortedSectors[0][0]}.`);
  } else if (growthSectorWeight >= 30) {
    riskLevel = 'Moderate';
    traderType = 'Growth-Leaning Investor';
    summaryParts.push(`Your portfolio has a significant allocation to growth sectors.`);
  }

  const recommendedSectors = ['Consumer Staples', 'Healthcare', 'Utilities', 'Industrials'];
  const possibleDiversification = [];
  const portfolioSectors = Object.keys(exposures);

  for (const recSector of recommendedSectors) {
    if (!portfolioSectors.some(ps => ps.toLowerCase().includes(recSector.toLowerCase().slice(0, 5)))) {
      if (possibleDiversification.length < 2) {
        possibleDiversification.push({
          sector: recSector,
          recommendation: `Consider adding exposure to the ${recSector} sector to improve stability and diversification.`
        });
      }
    }
  }

  if (possibleDiversification.length > 0) {
    summaryParts.push(`Consider diversifying into areas like ${possibleDiversification.map(r => r.sector).join(' and ')} to reduce risk.`);
  }
  
  summaryParts.push(`The calculated one-year return is ${performance.oneYearReturn}%.`);

  return {
    portfolioAnalysis: {
      totalValue: totalPortfolioValue,
      sectorDiversification: exposures,
      riskLevel: riskLevel,
      performance: performance
    },
    possibleDiversification: possibleDiversification,
    traderType: traderType,
    summary: summaryParts.join(' ')
  };
}


// --- CORRECTED calculatePerformance function ---
async function calculatePerformance(weightedHoldings) {
  const tickers = Object.keys(weightedHoldings);
  
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    // Create an array of promises, one for each ticker
    const promises = tickers.map(ticker => {
      const yahooTicker = ticker.toUpperCase().endsWith('.NS') ? ticker : `${ticker}.NS`;
      // Fetch data for each ticker individually
      return yahooFinance.historical(yahooTicker, { period1: fiveYearsAgo });
    });

    // Wait for all promises to resolve in parallel
    const allHistoricalData = await Promise.all(promises);
    
    let returns = { oneYear: 0, threeYear: 0, fiveYear: 0 };

    allHistoricalData.forEach((stockData, index) => {
      const ticker = tickers[index];
      const stockWeight = weightedHoldings[ticker];

      if (stockData && stockData.length > 1) {
        const endPrice = stockData[stockData.length - 1].close;
        const fiveYearStartRecord = stockData[0];
        const threeYearStartRecord = stockData.find(d => new Date(d.date) >= threeYearsAgo);
        const oneYearStartRecord = stockData.find(d => new Date(d.date) >= oneYearAgo);

        if (fiveYearStartRecord) {
          returns.fiveYear += stockWeight * ((endPrice - fiveYearStartRecord.close) / fiveYearStartRecord.close);
        }
        if (threeYearStartRecord) {
          returns.threeYear += stockWeight * ((endPrice - threeYearStartRecord.close) / threeYearStartRecord.close);
        }
        if (oneYearStartRecord) {
          returns.oneYear += stockWeight * ((endPrice - oneYearStartRecord.close) / oneYearStartRecord.close);
        }
      }
    });
    
    return {
      oneYearReturn: parseFloat((returns.oneYear * 100).toFixed(2)),
      threeYearReturn: parseFloat((returns.threeYear * 100).toFixed(2)),
      fiveYearReturn: parseFloat((returns.fiveYear * 100).toFixed(2)),
    };
    
  } catch (error) {
    console.error("Yahoo Finance API Error:", error.message);
    throw new Error(`Failed to fetch financial data. Please check if ticker symbols are valid for your region (e.g., 'RELIANCE.NS').`);
  }
}

// --- Main analyzePortfolioData function remains the same ---
const analyzePortfolioData = async (funds) => {
  const totalPortfolioValue = funds.reduce((sum, fund) => sum + fund.amount, 0);
  if (totalPortfolioValue === 0) throw new Error("Portfolio value cannot be zero.");
  funds.forEach(fund => { fund.share = fund.amount / totalPortfolioValue; });
  
  const allHoldings = {};
  funds.forEach(fund => {
    for (const [ticker, weight] of Object.entries(fund.holdings)) {
      allHoldings[ticker.toUpperCase()] = (allHoldings[ticker.toUpperCase()] || 0) + (weight * fund.share);
    }
  });

  const allSectors = new Set(funds.flatMap(f => Object.keys(f.sectors)));
  const weightedExposures = {};
  allSectors.forEach(sector => {
    weightedExposures[sector] = funds.reduce((sum, fund) => sum + (fund.share * (fund.sectors[sector] || 0)), 0);
  });
  
  const formattedExposures = {};
  for (const [sector, weight] of Object.entries(weightedExposures)) {
    formattedExposures[sector] = parseFloat((weight * 100).toFixed(2));
  }

  const performance = await calculatePerformance(allHoldings);
  
  const quantitativeData = {
    totalPortfolioValue,
    sectorDiversification: { weightedExposures: formattedExposures },
    performance,
  };

  const finalReport = generateQualitativeReport(quantitativeData);
  
  return finalReport;
};

module.exports = { analyzePortfolioData };