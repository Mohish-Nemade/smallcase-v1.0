const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config/config');
const serverResponse = require("./middlewares/serverResponse");

// Database connected to MongoDb atlas
var mongoDB = config.db.url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var db = mongoose.connection;

db.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
});

var tradeRoutes = require('./routes/tradeRoutes');


const app = express();
const port = process.env.PORT || 8080;

app.use(serverResponse());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/trades', tradeRoutes);

app.get('/', (req, res) => {
  res.send(`Server is up and running at port ${port}`)
})

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});



