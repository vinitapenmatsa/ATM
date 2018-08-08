/* Load Modules */
const express = require('express');
const router = express.Router();
const login = require("../service/login")


/**
 *     POST call to login with account number and password.
 */
router.post('/', [login.checkIfAccountNumber, login.checkIfAccountExists, login.checkIfPasswordNotEmpty , login.loginUser ], (req, res, next) => {
  res.status(200).json({
    message: 'POST requests to /login'
  });
});

module.exports = router;
