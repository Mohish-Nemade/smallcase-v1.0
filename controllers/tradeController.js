const updatetradeService = require('../services/updateTradeService');
const addTradeService = require('../services/addTradeService');
const delTradeService = require('../services/delTradeService');
const PortfolioModel = require('../models/portfolioModel');
const portfolioService = require('../services/portfolioService');

// Function to insert a trade for a security in the portfolio
const addTrades = async function (req, res) {

    var trades = req.body.trades;
    var portId = req.body.portId;
    try {
        let result = await addTradeService.addTrade(portId, trades);
        if (result) {
            res.sendCreated(result);     }
        else {  res.sendCreated("Error occured while adding Trade"); }

    }
    catch (err) {
        console.log(JSON.stringify(err));
        res.sendCreated(err.message)
    }
};

 // Function to update a trade for a security in the portfolio
const updateTrade = async function (req, res) {
    var body = req.body;
    var responseContent;
    try {
        let result = await updatetradeService.updateTrade(body);
        if (result) {
            res.sendCreated(result);     }
        else {  res.sendCreated("Error occured"); }
    }
    catch (ex) {
        console.log(JSON.stringify(ex));
        res.sendCreated(ex.message)
    }
};

// Function to delete a trade for a security in the portfolio
const deleteTrade = async function (req, res) {
    var portId = req.body.portId;
    var tradeId = req.body.tradeId;
    console.log("dssds")
    try {
        await delTradeService.deleteTrade(portId, tradeId);
        res.sendCreated("Deleted successfully");     
    }
    catch (ex) {
        console.log(JSON.stringify(ex));
        res.sendCreated(ex.message)
    }
}


// Function to fetch complete portfolio data consisiting it's securities and their corresponding trades.
const getPortfolioTradeData = async function (req, res) {
    var portId = req.query.portId;

    var responseContent;
    try {
        var portfolioData = await portfolioService.getPortfolioTradeData(portId);
        console.log("aaaa"+portfolioData); 
        let responsejson = {
            portfolioData
          };
        return res.json(responsejson);
    }
    catch (err) {
        console.log(err);
        res.sendCreated(err.message)
    }
}

//Function to fetch current holdings
const getHoldings = async function (req, res) {
    var portId = req.query.portId;
    try {
        var PortfolioHoldings = await portfolioService.getHoldings(portId);
        let responsejson = {
            PortfolioHoldings
          };
        return res.json(PortfolioHoldings);
     
    }
    catch (err) {
        console.log(err);
        res.sendCreated(err.message)
      
    }
}

 //Function to fetch the current portfolio returns
const getPortfolioReturns = async function (req, res) {
    var portId = req.query.portId;
        try {
        var returns = await portfolioService.getPortfolioReturns(portId);
        let responsejson = {
            returns
          };
        return res.json(responsejson);
    }
    catch (err) {
        console.log(err);
        res.sendCreated(err.message)
      
    }
}


module.exports = { addTrades, updateTrade, deleteTrade ,getPortfolioTradeData, getHoldings,getPortfolioReturns};