/****
 * Author: Omar M.
 * Project: My Pitstop fictional vehicle web shop
 */

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000 // for different web hosts (AWS, etc.)
process.env.NODE_ENV = 'production'; // set this on AWS, Azure, localhost, etc.

// Throttle modules
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Data model
const { vendors, vehicles, sensorData } = require('./data');

// Parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//--------------------------------------------------------------------------------------
// Log facility

// create custom timestamp format for logging events
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'mypitstop.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

//--------------------------------------------------------------------------------------
// Throttle middleware

// Rate limit requests (will apply to POST only)
const getDataRateLimiter = rateLimit ({
  windowMs: 60 * 1000, // 1 minute window
  max: 500, // start blocking after 500 requests (429 response)
  message: "Too many API requests, please try again later..."
});

// Slow down requests (will apply to POST only)
const getDataSlowDown = slowDown ({
  windowMs: 60 * 1000, // 1 minute window
  delayAfter: 500, // allow 500 requests to go at full-speed, then...
  delayMs: 1000 // 501th request has a 1000ms delay, etc. (1 req/sec)
});

//------------------------------------------------------------------------------------------
// Routes

// GET /api/:accountId/vehicles
app.get("/api/:accountId/vehicles", paginate(vehicles), (req, res) => {
  if (vendors[req.params.accountId] ){
    // res.status(200).send(res.paginatedResult);
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
      log.warn(`Sensor data for vehicle: ${req.body.search} was not found!`);
      res.send(`Sensor data for vehicle: ${req.body.search} was not found!`);
      return;
    }

    log.info(`POST /api/getData: sensor data for vehicle id: ${req.body.search} was found`);
    res.send(sensorData.find(({ id }) => id === req.body.search));
    // res.status(200).send('Success');
  } else {
    log.warn(`Sensor data for vehicle: ${req.body.search} was not found!`);
    res.send(`Sensor data for vehicle: ${req.body.search} was not found!`);
  }
});

// -------------------------------------------------------------------------------------
// Error handling

// Will throw intentional error with custom message
app.get('/error-route', (req, res, next) => {
  // mimic an error by throwing an error to break the app!
  log.error('GET /error-route: Error: route is broken!');
  res.status(500).send('GET /error-route: Error: route is broken!');
  throw new Error('GET /error-route: Error: route is broken!');
})

// Will matches all routes and all methods and display custom error message
// Should ALWAYS be added after all GET, POST routes to work correctly with Express routing tables
app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: 'Error! No matching route was found. All RESTful API calls should start with: /api/',
  })
});

// Built in error handler (like catch all)
app.use(function (err, req, res, next) {
  log.error(err.stack);
  res.status(500).send('Error: API is broken!')
});

// creating a port for server to listen on
app.listen(port, () => {
  log.info(`My Pitstop vendor API is running on port ${port}...`);
});

//-----------------------------------------------------------------------------------------
// Helper functions

function paginate(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // default is first page
    const limit = parseInt(req.query.limit) || 5; // default is 5 records per page
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
    next(); // pass control to the next handler
  };
}
