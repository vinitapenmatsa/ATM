/* load modules */
const express = require('express');
const app = express();
const cors = require('cors')
const logger = require('morgan');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');//.verbose();
const database = require('./server/config/dbconfig');

/* Express configurations */
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((res, req, next) => {
  console.log("** Incoming Request **",req.body);
  next();
});

/* REST contollers */
const loginController = require('./server/routes/loginRoute');
const withdrawalController = require('./server/routes/withdrawalRoute');

/* CORS Filters */
app.use(cors());
app.use((res, req, next) => {
  res.header("ACCESS-Control-Allow-Origin", "*");
  res.header(
    "ACCESS-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

/* Route Handlers TODO : move this to a base router file */
app.use('/login', loginController);
app.use('/withdraw', withdrawalController);

/* Catch all 404 and forward to error handler */
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

/* Error Handler */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
