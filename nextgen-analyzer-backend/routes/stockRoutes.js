// routes/stockRoutes.js

const express = require('express');
const router = express.Router();
const { getStockEvaluation } = require('../controllers/stockController');

router.post('/evaluate', getStockEvaluation);

module.exports = router;