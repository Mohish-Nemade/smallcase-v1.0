const _ = require('lodash');

// search the security in the portfolio of particular portId
const searchSecurityNew = function (portfolioM,secId) {
    
   if (portfolioM && portfolioM.portfolio && portfolioM.portfolio.length > 0) {

        return _.findIndex(portfolioM.portfolio,function(doc){
           
            return String(doc.securityId) === String(secId);
        }) 
    }
    else{
        return -1;
    }
}

module.exports = {
    searchSecurityNew
};