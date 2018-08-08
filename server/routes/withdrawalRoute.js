/* Load Modules */
const express = require('express');
const router = express.Router();
const withdrawal = require("../service/withdrawal")

/**
*   POST call to withdraw an amount
**/
router.post('/', [withdrawal.checkIfAmountValid,withdrawal.checkIfAccountBalanceSufficient,withdrawal.checkIfCashSufficient,withdrawal.withdraw], (req, res, next) => {
  res.status(200).json({
    message: 'POST requests to /withdraw'
  });
});

module.exports = router;
