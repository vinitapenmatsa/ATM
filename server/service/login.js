const Account = require('../model').Account;
const crypto = require('crypto');


/**
 * Validates Account Numer Checks if
 * -> Account number is a Numeric
 * -> Account number is 9 digits
 */
let checkIfAccountNumber = function(req, res, next) {
  //check if valid number
  if (isNaN(req.body.accountNumber)) {
    let message = 'Account has to be a valid number';
    console.log(message);
    res.status(400).json(message);
  } else if (req.body.accountNumber.length != 9) {
    let message = 'Account Number must have 9 digits';
    console.log(message);
    res.status(400).json(message);
  } else {
    next();
  }
};

/**
 * Checks if account exists
 */
let checkIfAccountExists = function(req, res, next) {
  //check if account number exists
  Account.count({
    where: {
      accountNumber: req.body.accountNumber
    }
  }).then(count => {
    if (count != 0) {
      next();
    } else {
      let message = 'Account Number Not Found';
      console.log(message);
      res.status(400).json(message);
    }
  });
};

/**
 *  Checks for password not empty
 */
let checkIfPasswordNotEmpty = function(req, res, next) {

  if (!req.body.password) {
    let message = 'Enter a password';
    console.log(message);
    res.status(400).json(message);
  } else {
    next();
  }
};

/*
*  logs user in if credentials are valid
*/
let login = function(req, res, next) {

  Account.findOne({
    where: {
      accountNumber: req.body.accountNumber
    }
  }).then(account => {
    //check password hashes
    let passwordHash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    console.log('***PASSWORD HASHES***', passwordHash , account.password );
    if (account.password === passwordHash) {
      console.log('Login successful');
      res.status(200).json({
        accountNumber: account.accountNumber,
        firstName: account.firstName,
        lastName: account.lastName,
        currentBalance: account.balance
      });
    } else {
      let message = 'Incorrect Password';
      console.log(message);
      res.status(400).json(message);
    }
  });

};


module.exports = {
    checkIfAccountNumber: checkIfAccountNumber,
    checkIfAccountExists : checkIfAccountExists,
    checkIfPasswordNotEmpty : checkIfPasswordNotEmpty,
    loginUser : login
};
