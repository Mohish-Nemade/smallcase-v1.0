const mongoose = require('mongoose');

const PortfolioSchema = mongoose.Schema;

var portfolioModelSchema = new PortfolioSchema({

    portfolio: [
        {

            securityId: {
                type: mongoose.Types.ObjectId,
               ref: 'SecuritiesModel'
            },
            avgBuyPrice: Number,
            totalShares: Number
    
        }
    ],

   trades:[{type:mongoose.Types.ObjectId}]

});

var PortfolioModel = mongoose.model('PortfolioModel', portfolioModelSchema);

module.exports = PortfolioModel;