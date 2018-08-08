const defaults = require('../config/default.js')
const models = require("../model");


let currentBalance;
/*
 *  function to validate withdrawal amount
 */
let checkIfAmountValid = function(req, res, next) {

  console.log("*** Validating witdrawal amount ***");
  if (req.body.amount === "" || isNaN(req.body.amount) || parseInt(req.body.amount) <= 0) {
    res.status(400).json('Enter a valid withdrawal amount');
  } else {
    next();
  }
};

/**
 *  function to check if account has balance > withdrawal amount
 */
let checkIfAccountBalanceSufficient = function(req, res, next) {

  console.log("*** Checking if account has sufficient balance ***");
  const accountNumber = req.body.accountNumber.toString();
  models.Account.findOne({
    where: {
      accountNumber: accountNumber
    },
    raw: true
  }).then(account => {
    if( parseInt(account.balance) < parseInt(req.body.amount) ) {
      console.log("*** Insuffficient account balance ***");
      currentBalance = account.balance;
      res.status(400).json('Account does not have sufficient balance. Please try a smaller amount')
    } else {
      currentBalance = account.balance;
      console.log(" currentBalance " , account );
      next();
    }
  });
};

/**
 * function to check ATM has sufficient cash
 */
let checkIfCashSufficient = function(req, res, next) {

  console.log("*** Checking if ATM has sufficient cash ***");
  models.sequelize.query('SELECT SUM( value * quantity ) AS cash FROM Notes', {
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(result => {
      let availableCash = result[0].cash;
      if (availableCash < parseInt(req.body.amount)) {
        console.log("*** Insufficient cash ***" , availableCash);
        res.status(400).json('Sorry , ATM is out of cash. Please try a smaller amount');
      } else {
        next();
      }
    })

};

/**
 *  function to withdraw minimum notes / coins for given amount
 *   TODO suggest closest amount if given amount is not possible
 */
let withdraw = function(req, res, next) {

   return getCashPool().then( (result) => {
     // get Change
      let change = getChange(result , parseInt(req.body.amount));
      if(change.length == 0){
        return res.status(400).json("Change Not Available , try rounding up or try a larger amount");
      }

      const updatedBalance = currentBalance - parseInt(req.body.amount);
      //update balances
      return updateBalances(change,req.body.accountNumber,updatedBalance).then( (result) =>{
        //return response if transaction successful
        const consolidatedChange = consolidateChange(change);

        let response = {};
        response.cash = consolidatedChange;
        response.accountNumber = req.body.accountNumber;
        response.currentBalance = updatedBalance;

        //console.log("Withdrwal Response" , response);
        return res.status(200).send(response);

      }).catch( (error) => {
        console.log(error);
        return res.status(500).json("Internal Server Error");
      })
   },
   (error) => {
       console.log("Error Retrieving Cash Pool" , error);
       return res.status(500).json("Internal Server Error");
   })
};



let getCashPool = function(){

   console.log("*** Retrieving current cash pool ***");
    return new Promise(function(resolve , reject){
      //get cash pool from DB
      models.Note.findAll({
        where:{
          quantity: {
            gt: 0
          }
        },
        order: [
            ['value', 'ASC'],
        ],
        raw: true,
        attributes: [ 'value' , 'quantity' , 'type' ]
      }).then( result => {
        console.log("**CASH POOL**",result);
        let cashPool = [];
        cashPool.push(...result);
        resolve(cashPool);
      }).catch( error => {
        reject(error);
      })
    })
};

/**
*  Consolidated Number of Notes
*/
let consolidateChange = function(change){

  let consolidatedChange = {}

   change.forEach((note) => {
    if(!consolidatedChange[note.value]){
      consolidatedChange[note.value] = {
        quantity: 1,
        type: note.type,
        stock: note.quantity
      };
    }else{
      consolidatedChange[note.value].quantity += 1;
    }
  });

  return consolidatedChange;

}

/**
*   Function to Get Change for Withdrawal amount.
*/
let getChange = function(cashPool,amount){

  console.log("** selecting algorithm ( greedy / DP ) ** ");
  if(defaults.algorithm && defaults.algorithm === "greedy")
     return greedyAlgorithmToGetChange(cashPool, amount);

  return dpAlgorithmToGetChange(cashPool,amount)

}

/**
*  Greedy Algorithm to get Minimum Number of Notes / Coins.
*  Optimal when denominations are canonical Eg: { 1, 2, 5, 10, 20 }
*/
let greedyAlgorithmToGetChange = function( cashPool , amount ){
  console.log("*** Running greedy algorithm ***");
  let change = [];
  let i = cashPool.length-1;

  // Get max possible denomination * max quantity of denomination for given amount
  // repeat for remaining amount and denominations
  while( i >= 0 ){
    while(amount >= cashPool[i].value && cashPool[i].quantity > 0){
      amount = amount - cashPool[i].value;
      cashPool[i].quantity -= 1;
      change.push(cashPool[i]);
      //console.log("pool",change);
    }
    i--;
  }
  //console.log("**CHANGE**" , change);
  if(amount > 0)
    return [];

  return change;
}

/**
*  DP Algorithm to get minimum number of Notes / coins
*  Optimal when denominations are non-canonical Eg: {1, 2, 5, 12, 25}
*/
let dpAlgorithmToGetChange = function( cashPool , amount ){
    console.log("*** Running DP algorithm ***");
    return dpAlgorithToGetChange( cashPool , amount )
}

/*
* Helper function to get change.
*/
let dpAlgorithToGetChange = function( cashPool , amount ){ //130

  let note;
  let max = amount + 1; //131
  let dp = new Array(max); //dp[131]
  let coinCount = new Array(max); //coinCount[131]

  coinCount.fill(0); //coinCount[131] == all zeros
  dp.fill(max); // dp all 131
  dp[0] =  0; // [0,131,131,]

  for (let i = 1; i <= amount; i++) { //131 times
    for (let j = cashPool.length-1 ; j >= 0 ; j--) { // 1000, 500, 200, 100, 50, 20, 10 , 5 , 2 , 1
      if (cashPool[j].value <= i && cashPool[j].quantity > 0) {
        //console.log(dp);
        if( (dp[i - cashPool[j].value] + 1) < dp[i] ){
             dp[i] = dp[i - cashPool[j].value] + 1;
             note = j;
        }
      }
    }
   coinCount[i] = note;
  }

  if(dp[amount] > amount)
     return [];

  console.log("** COIN COUNTS **" ,...dp );
  return countNotesDup(cashPool,coinCount,amount,[]);

}

/*
*  Counts Denominations
*/
let countNotesDup = function( cashPool , coinCount  , amount , change){ // 1 100 , 3 50   /220 //

   let a = amount;

   if(amount === 0)
     return change;

   if(cashPool[coinCount[a]].quantity > 0) {
    console.log("Use coin of denomination", a ,cashPool[coinCount[a]]);
    cashPool[coinCount[a]].quantity -= 1;
    change.push(cashPool[coinCount[a]])
    countNotesDup(cashPool,coinCount,a - cashPool[coinCount[a]].value,change);
  }else{
    countNotesDup(cashPool,coinCount,a - cashPool[coinCount[a]-1].value,change);
    countNotesDup(cashPool,coinCount,cashPool[coinCount[a]-1].value,change);
  }

   //console.log("**CHANGE**" , change);
   return change;
}

/*
*  Determines if a given set of denominations are canonical or not.
*  Returns True if canonical and false otherwise
*/
let isCanonical = function( cashPool ){

}

let updateBalances = function(change, accountNumber, updatedBalance) {

  console.log("*** Updating balances ***");
  return models.sequelize.transaction((t) => {

    //Updates
    return Promise.all(updateNoteQuantities(change))
    .then((result) =>{
      console.log("*** Updated cash balance ***" , result);
      return updateAccountBalance( accountNumber, updatedBalance)
       .then((result) =>{
         console.log("*** Updated account balance ***" , result);
       })
    })

  }).then( (result) => {
    console.log("*** Update transaction completed ***" , result);
    //t.commit();
  }).catch( (error) => {
    console.log("*** Update transaction rolledBack ***" , error );
    //t.rollback();
  });
}

/**
* Updates balance for a given account number
*/
let updateAccountBalance = function( accountNumber , updatedBalance ){

   //console.log("Updating Account Balance " , accountNumber , updatedBalance );
    return new Promise(function(resolve , reject){

      models.Account.update(
        { balance: updatedBalance },
        { where: { accountNumber: accountNumber }}
      ).then( result => {
        resolve(result);
      }).catch( error => {
        console.log("Error Updating Account Balance" , error );
        reject(error);
      })
    })
}

/**
*  updates quantity for a given array of notes
*/
let updateNoteQuantities = function( change ){

  //console.log("Updating Notes" , change );
  let promises = [];

  change.forEach( function (denomination){
     //console.log("**Promises For Each Denomination**" , denomination);
     promises.push(new Promise((resolve,reject) => {

       //update query for each denomination selected
       models.Note.update(
         { quantity: denomination.quantity },
         { where: { value : denomination.value }}
       ).then( result => {
          //console.log(denomination.value , "updated");
          resolve([denomination.value , "updated"]);
       }).catch( error => {
          console.log("Error Updating Notes" , error);
          reject(error);
       })

     })); //End of Promises.push
  }); //End Of forEach

  return promises;

}



module.exports = {
    checkIfAmountValid: checkIfAmountValid,
    checkIfAccountBalanceSufficient : checkIfAccountBalanceSufficient,
    checkIfCashSufficient : checkIfCashSufficient,
    withdraw : withdraw,
    utilities: {
      getCashPool: getCashPool,
      greedyAlgorithmToGetChange: greedyAlgorithmToGetChange,
      dpAlgorithmToGetChange : dpAlgorithmToGetChange

    }
};
