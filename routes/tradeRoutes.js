const express = require('express');
const router = express.Router();
const tradeController = require("../controllers/tradeController");

router.post('/add', tradeController.addTrades);

router.put('/update', tradeController.updateTrade)

router.delete('/delete', tradeController.deleteTrade);

router.get('/getPortfolio',  tradeController.getPortfolioTradeData);

router.get('/getHoldings', tradeController.getHoldings);

router.get('/getReturns', tradeController.getPortfolioReturns);

module.exports = router;

