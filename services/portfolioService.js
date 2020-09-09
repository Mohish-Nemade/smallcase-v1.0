
const PortfolioModel = require('../models/portfolioModel');


// method to get the portfolio information with associated trade data for the securities
const getPortfolioTradeData = async function (portId) {

           var query= ([
        {$project :{ _id : 0, trades : 1}},
        {
            $lookup:
            {
              from: "tradesmodels",
              localField: "trades",
              foreignField: "_id",
              as: "fetch_trades"
        }},
        {$project : { fetch_trades : 1}}
        ]) 

        var trades = await PortfolioModel.aggregate(query);
        var demo ={}

        trades[0].fetch_trades.forEach(element => {
                if(!demo[element.securityId])
                {
                    demo[element.securityId]=[element]; }
                else
                    demo[element.securityId].push(element)
        });

        return demo;
}

// method to fetch portfolio returns
const getPortfolioReturns = async function (portId) {
    var portfolio = await PortfolioModel.findOne({_id:portId});

    if (portfolio) {
        let returns=0;

        for (i = 0; i < portfolio.portfolio.length; i++) {

    returns+=(100 - portfolio.portfolio[i].avgBuyPrice) * portfolio.portfolio[i].totalShares;

    }   
          return returns;
    } else {
        return Promise.reject( { message: "Portfolio not found for user ID " });
    }
}


// gets all trade information using aggregation 
const getHoldings = async function (portId) {
    const query = [
        {$project:{portfolio:1}}
        ]
    var trades = await PortfolioModel.aggregate(query);
    console.log(trades)

    return trades;
}

module.exports = {
    getHoldings,
    getPortfolioTradeData,
    getPortfolioReturns
};