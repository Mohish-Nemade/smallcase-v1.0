const TradeModel = require('../models/tradesModel');
const searchSecurity = require('../services/searchSecurityService');

const PortfolioModel = require('../models/portfolioModel');
const _ = require('lodash');

// service method to delete a trade
const deleteTrade = async function (portId, tradeId) {
    //get the portfolio
    var getPort = await PortfolioModel.findById( portId );

    console.log(tradeId)
    if (getPort) {
        //fetch the trade to be deleted
        var getTrade = await TradeModel.findOne({ _id: tradeId  })
        if (!getTrade) {
            return Promise.reject({ message: "Trade doesn't exist in TradesmModel" })
        }
        // search thr security in the portfolio
        var securityIndex = searchSecurity.searchSecurityNew(getPort, getTrade.securityId);

        if (getTrade.type == "BUY") {

            if (securityIndex != -1) {
                //portfolio needs to have a higher quantity as we need to subtract the requested quantity:
                if (getPort.portfolio[securityIndex].totalShares >= getTrade.quantity) {
                    
                    // update the avg price
                    getPort.portfolio[securityIndex].avgBuyPrice = ((getPort.portfolio[securityIndex].totalShares 
                        * getPort.portfolio[securityIndex].avgBuyPrice) -(getTrade.quantity* 100)) / (getPort.portfolio[securityIndex].totalShares - getTrade.quantity);

                    //subtract the requested quantity:
                    getPort.portfolio[securityIndex].totalShares =
                    getPort.portfolio[securityIndex].totalShares - getTrade.quantity;

                    //Now delete the trade:
                    var result = await TradeModel.deleteOne({
                        _id: getTrade._id
                    })
                   // Pull the requested trade
                    const temp= await PortfolioModel.findOneAndUpdate({"_id":getPort._id},{$pull:{trades:getTrade._id}})
                    console.log(temp,temp)
                         await getPort.save()

                    return result;
                }
                else {
                    return Promise.reject({ message: "Portfolio contains a lesser quantity of the security" })
                }
            }
            else {
                return Promise.reject({ message: "The requested security doesn't exist in the portfolio" })

            }
        }
        else if (getTrade.type == "SELL") {
         
            if (securityIndex != -1) {
                //add back the trade quantity sold by the trade previously
                getPort.portfolio[securityIndex].totalShares =
                getPort.portfolio[securityIndex].totalShares + getTrade.quantity;

                //Now delete the trade:
                var result = await TradeModel.deleteOne({
                    _id: getTrade._id
                })
            }
            else {
                //this security will not be present in the portfolio, so add it:
               
                const sample={
                    securityId: getTrade.securityId,
                    avgBuyPrice: 100,
                    totalShares: getTrade.quantity
                }
                
               await PortfolioModel.findOneAndUpdate({"_id":getPort._id},{$push:{portfolio:sample}})
            }
            //update the portfolio accordingly:
            const temp= await PortfolioModel.findOneAndUpdate({"_id":getPort._id},{$pull:{trades:getTrade._id}})

            await getPort.save()

            return result;
        }
    }
    else {
            return Promise.reject({ message: "unable to get portfolio data." })
    }
}

module.exports = {deleteTrade}