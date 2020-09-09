const TradeModel = require('../models/tradesModel');
const searchSecurity = require('../services/searchSecurityService');
const PortfolioModel = require('../models/portfolioModel');
const _ = require('lodash');

// Service method to add a trade for a security in a portfolio
const addTrade= async function (portId, givenTrade) {

    var getPort = await PortfolioModel.findById(portId);

    if(!getPort)
        return Promise.reject({ message: "Portfolio not found"}) 

    const trades=new TradeModel({securityId: givenTrade.securityId,
            type: givenTrade.tradeType,
            quantity:givenTrade.tradeQuantity,
            price: givenTrade.tradeQuantity * 100
        });   

    var ticker = searchSecurity.searchSecurityNew(getPort,givenTrade.securityId); //check if the security for which the trade is placed exists in the portfolio
    console.log(ticker+"fsd");

         
        if (givenTrade.tradeType == "BUY") { //if the trade is a BUY trade
            
             if (ticker == -1)  {
                const sample={
                    "securityId": givenTrade.securityId,
                    "totalShares": givenTrade.tradeQuantity,
                    "avgBuyPrice": 100
                }

            try{
                //push the new trade in portofolio in respective user portId
               const temp= await PortfolioModel.findOneAndUpdate({"_id":getPort._id},{$push:{portfolio:sample}})
              
            }
            catch(err){
                return Promise.reject({ message: "Error in updating model"}) 

            }
            }
             else {
                 //calculate the average buy price
                 getPort.portfolio[ticker].avgBuyPrice = ((getPort.portfolio[ticker].totalShares * getPort.portfolio[ticker].avgBuyPrice) + 
                 (givenTrade.tradeQuantity* 100)) / (getPort.portfolio[ticker].totalShares + givenTrade.tradeQuantity);
                //update the security quantity in the portfolio:
                getPort.portfolio[ticker].totalShares = getPort.portfolio[ticker].totalShares + givenTrade.tradeQuantity;
              
         }
     
     
         }
         else{
             
            if (givenTrade.tradeType == "SELL") {
                if (ticker == -1)
                   return Promise.reject({ message: "The security  doesn't exist in the portfolio"});

            if (ticker != -1) {
                 //sell trade can be allowed only if the portfolio has greater quantity of shares than the no. of shares requested to be sold:
                if (getPort.portfolio[ticker].totalShares >= givenTrade.tradeQuantity) {
                    getPort.portfolio[ticker].totalShares = getPort.portfolio[ticker].totalShares - givenTrade.tradeQuantity;
                }
                else {
                    return Promise.reject( { message: "Not enough quantity to sell for "})}
            }
        }
    }    
     
    //update the portfolio accordingly:
    const tradeRes = await trades.save();
    getPort.trades.push([tradeRes._id ]);
    await getPort.save();

    return tradeRes;
};

module.exports = {
    addTrade
}