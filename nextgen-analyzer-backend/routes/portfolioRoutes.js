// routes/portfolioRoutes.js

const express = require('express');
const router = express.Router();
const { getPortfolioAnalysis } = require('../controllers/portfolioController');

// Define the POST route. The full URL will be /api/portfolio/analyze
router.post('/analyze', getPortfolioAnalysis);

module.exports = router;