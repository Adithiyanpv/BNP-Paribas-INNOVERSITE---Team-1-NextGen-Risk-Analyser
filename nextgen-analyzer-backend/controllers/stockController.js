// controllers/stockController.js

const { evaluateStockData } = require('../services/stockService');

const getStockEvaluation = (req, res) => {
  try {
    
    const { stockSymbol, parameters } = req.body;

    if (!stockSymbol || !parameters) {
      return res.status(400).json({ message: 'Missing stockSymbol or parameters in request body' });
    }

    
    const analysisResult = evaluateStockData(parameters);

    
    res.status(200).json({
      stockSymbol,
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