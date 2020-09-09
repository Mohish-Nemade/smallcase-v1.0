const mongoose = require('mongoose');

const TradesSchema = mongoose.Schema;

var tradesModelSchema = new TradesSchema({
   
    
    securityId: {
        type: mongoose.Types.ObjectId,
        ref: 'SecuritiesModel'
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'] //Buy or Sell
    },
    quantity: {
        type: Number,
        min: 1
    },
    price: Number,
  
    createdAt: { type: Date, default: new Date() }
});

var TradesModel = mongoose.model('TradesModel', tradesModelSchema);

module.exports = TradesModel;