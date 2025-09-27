// controllers/stockController.js
const { evaluateStockData } = require('../services/stockService');

const getStockEvaluation = (req, res) => {
  try {
    const { stockSymbol, parameters } = req.body;

    if (!stockSymbol || !parameters) {
      return res.status(400).json({ message: 'Missing stockSymbol or parameters' });
    }

    const analysisResult = evaluateStockData(parameters);

    // This is the corrected response that includes the raw numbers for the visuals
    res.status(200).json({
      stockSymbol,
      parameters, // The frontend needs this for the gauges
      feedback: analysisResult.feedback,
      summary: analysisResult.summary,
    });
    
  } catch (error) {
    console.error('Error during stock evaluation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getStockEvaluation,
};