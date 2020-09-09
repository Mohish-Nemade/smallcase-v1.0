const mongoose = require('mongoose');

const SecuritiesSchema = mongoose.Schema;

var securitiesModelSchema = new SecuritiesSchema({
    
    tickerSymbol: String,
    securityName: String

});

var SecuritiesModel = mongoose.model('SecuritiesModel', securitiesModelSchema);

module.exports = SecuritiesModel;