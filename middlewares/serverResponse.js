module.exports = () => {
  return (req, res, next) => {
    res.sendCreated = function(responseObject = {}) {
      return this.status(200).json(responseObject);
    };

    res.sendBadRequest = function(responseObject = {}) {
      if (responseObject.isJoi) {
        const errorMessage = responseObject.details[0].message;
        return this.status(400).json({ message: errorMessage });
      }
      return this.status(400).json(responseObject);
    };

    res.sendServerError = function() {
      return this.status(500).json({ message: "Internal server error" });
    };

    res.sendAlreadyExists = function(responseObject = {}) {
      return this.status(409).json(responseObject);
    };

    res.sendNotFound = function() {
      return this.status(404).json({ message: " Not found!" });
    };

    res.sendNotFoundWithMessage = function(responseObject) {
      return this.status(404).json(responseObject);
    };

    res.sendUnAuthorized = function(responseObject = {}) {
      return this.status(401).json(responseObject);
    };
    next();
  };
};
