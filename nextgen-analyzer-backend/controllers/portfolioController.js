// controllers/portfolioController.js

const { analyzePortfolioData } = require('../services/portfolioService');

const getPortfolioAnalysis = (req, res) => {
  try {
    const { funds } = req.body;

    // Basic validation
    if (!funds || !Array.isArray(funds) || funds.length === 0) {
      return res.status(400).json({ message: 'Request body must contain a non-empty array of funds.' });
    }

    const analysisResult = analyzePortfolioData(funds);
    res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('Error during portfolio analysis:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getPortfolioAnalysis,
};