// controllers/portfolioController.js
const { analyzePortfolioData } = require('../services/portfolioService');

const getPortfolioAnalysis = async (req, res) => {
  try {
    const { funds } = req.body;

    // Basic validation
    if (!funds || !Array.isArray(funds) || funds.length === 0) {
      return res.status(400).json({ message: 'Request body must contain a non-empty array of funds.' });
    }

    // Call the main service function and wait for the result
    const analysisResult = await analyzePortfolioData(funds);
    
    // Send the final report back to the client
    res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('Error during portfolio analysis:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getPortfolioAnalysis,
};