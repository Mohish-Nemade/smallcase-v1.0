const TradeModel = require('../models/tradesModel');
const PortfolioModel = require('../models/portfolioModel');
const _ = require('lodash');
const portfolioService = require('./portfolioService');
const securitiesService = require('./searchSecurityService');
const addTradeService = require('../services/addTradeService');
const delTradeService = require('../services/delTradeService');


//method to update an existing trade
const updateTrade = async function (body) {
    var getPort = await PortfolioModel.findById( body.portId );

    if (!getPort) {
        return Promise.reject({ message: "Portfolio not found"});
    } else {
        //fetch the trade by ID:
        var tradeData = await TradeModel.findOne({ _id: body.tradeId });
        if (!tradeData) {
            return Promise.reject({ message: "Trade not found for tradeId"});
        } else {
            //Search if requested security persent or not
            var index=securitiesService.searchSecurityNew(getPort,tradeData.securityId);

            if(index==-1)  // if security doesn't exist 
                return Promise.reject({ message: "Trade not found for tradeId"});

            // if requested update is for SELL
            if(body.trades.tradeType=='SELL')
            {

                // if requested update is for SELL and trade to be updated has also SELL trade type
                if(tradeData.type=='SELL')
                {
                        // Can only update if total quantity is greater than requested sell quantity
                        if(getPort.portfolio[index].totalShares+tradeData.quantity<body.trades.quantity)
                            return Promise.reject({ message: "Less quantity available to sell in portfolio"});                        
                }
                else{
                    // Can only update if total quantity is greater than requested sell quantity
                    if(getPort.portfolio[index].totalShares-tradeData.quantity<body.trades.quantity)
                            return Promise.reject({ message: "Less quantity available to sell in portfolio"});                        
                }
              }
             
              let resultadd = await addTradeService.addTrade(body.portId, body.trades);

              if (resultadd) 
              {
                  let resultdel = await delTradeService.deleteTrade(body.portId, tradeData._id);
                  if(!resultdel){
                       await addTradeService.deleteTrade(body.portId, body.trades);
                       return Promise.reject({ message: "Error occured while updating trade "});
                  }
                  return resultadd;
              }
              else 
              {   return Promise.reject({ message: "Error occured while updating trade "});
  
              }
        }
    }
}



module.exports = {
    updateTrade,
};