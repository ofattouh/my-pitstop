const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000 // for different web hosts (AWS, etc.)
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const { vendors, vehicles, sensorData } = require('./data');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create a custom timestamp format for log statements
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'pitstop.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},

log = SimpleNodeLogger.createSimpleLogger( opts );

// To throttle and limit POST requests
const getDataRateLimiter = rateLimit ({
  windowMs: 60 * 1000, // 1 minute window
  max: 500, // start blocking after 500 requests (429 response)
  message: "Too many requests, please try again later..."
});

// To throttle and slow down POST requests
const getDataSlowDown = slowDown ({
  windowMs: 60 * 1000, // 1 minute window
  delayAfter: 500, // allow 500 requests to go at full-speed, then...
  delayMs: 1000 // 6th request has a 1000ms delay, etc.
});

// Route: GET /api/:accountId/vehicles
app.get("/api/:accountId/vehicles", paginate(vehicles), (req, res) => {
  if (vendors[req.params.accountId] ){
    log.info(`GET /api/:accountId/vehicles. Accepted connection to /api/${req.params.accountId}/vehicles`);
    res.json(res.paginatedResult);
  } else {
    log.warn(`Vendor ${req.params.accountId} was not found!`);
    res.json(`Vendor ${req.params.accountId} was not found!`);
  }
});

// Route: POST /api/getData (throttled)
app.post("/api/getData", getDataRateLimiter, getDataSlowDown, (req, res) => {
  log.info('POST /api/getData: Accepted connection to fetch sensor data for vehicle id: ', req.body.search);

  if (req.body.accountId && !vendors[req.body.accountId]) {
    log.warn(`Vendor ${req.body.accountId} was not found!`);
    res.json('Vendor accountId was not found!');
    return;
  }
  
  if (req.body.type === "sensorData" && req.body.search) {
    if (!sensorData.find(({ id }) => id === req.body.search)){
      log.warn(`Error! sensor data for vehicle: ${req.body.search} was not found!`);
      res.send(`Error! sensor data for vehicle: ${req.body.search} was not found!`);
      return;
    }

    log.info(`POST /api/getData: sensor data for vehicle id: ${req.body.search} was found`);
    res.send(sensorData.find(({ id }) => id === req.body.search));
  } else {
    log.warn(`Error! sensor data for vehicle: ${req.body.search} was not found!`);
    res.send(`Error! sensor data for vehicle: ${req.body.search} was not found!`);
  }
})

// creating a port for server to listen on
app.listen(port, () => {
  log.info(`Pitstop vendor API is running on port ${port}...`);
});

// Helper functions
function paginate(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // default is page: 1
    const limit = parseInt(req.query.limit) || 5; // default is 5 records
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < model.length) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    result.results = model.slice(startIndex, endIndex);
    res.paginatedResult = result;
    next();
  };
}
