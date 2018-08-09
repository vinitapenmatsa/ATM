
## Table of Contents

- [Instructions](#instructions)
- [Implementation Details](#implementation-details)
- [Time Complexity](#time-complexity)
- [Unit Tests](#unit-tests)
- [Tech Stack](#tech-stack)


## Instructions

Following steps should get the REST service and UI running.

1. git clone the repository -> https://github.com/vinitapenmatsa/ATM.git
2. cd ATM/ 
3. npm install -> to get all dependencies
3. run 'npm start' command -> this should launch the server on port 8080 and client on port 3000.
4. access client using http://localhost:3000/  

App launch will direct you to a login page , you can use the following test data to login and test<br/>

test account number1: 123456789<br/>
password: coinifyaccount1<br/>

test account number2: 123789456<br/>
password: coinifyaccount1<br/>

test account number3: 345621789<br/>
password: coinifyaccount1<br/>

test account number4: 123123123<br/>
password: coinifyaccount1<br/>

ATM is loaded with the following denominations<br/>
10 * 1000 , 10 * 500 , 10 * 200 , 10 * 100 , 10 * 50 ,  10 * 20 , 10 * 10 , 10 * 5 , 10 * 2 , 10 * 1 ( total cash : 18,880 )<br/>


## Implementation Details

Crux of the challenge is to implement coin change generator with minimum number of coins, within the available ATM coin range. Which can be done in 2 ways.

- Greedy / Dynamic programming approach.

Although Dynamic programming approach yields optimal results for all types of coins / denominations , in cases where coin system is canonical ( 100, 200, 50, 20 ..) greedy algorithm yields optimal results without an additional memory overhead. However, in cases where the coin systems are non-canonical(23, 11, 5, 2 ...) greeady algorithm proves to be sub-optimal.

Hence I have implemented both greedy and dp algorithms in my solution in order for it to be reused for all types of coinsystems. Type of algorithm used is be driven by a config. 

config file: /server/defaults.js -> algorithm: "greedy" -> change this to "dp" to use dynamic programming algo.

Ideally , I would want to implement an algorithm that determines if the given set of denominations are caninical or not and then dynamically decide on which algorithm to use , however because of time contrains I haven't gone into implementing the isCanonical() function stub. This could be a future improvement.

## Time complexity

### Greedy Approach: 
  In this case you 
       - iterate over each coin to find the largest coin < sum and add it to the change set.
       - update sum to sum - coin value.
       - continue untill sum == 0
       
  Worst Case you iterate over all coins (m) * sum (n) times 
  
  Time complexity: O(m * n)<br>
  Space Complexity: O(0)

### DP Approach:
  In this case you find the optimal solution bottom - up , memorize it in order not to recompute the solution each time and   you go up. You iterate sum (m) times * coin set (n) times to find optimal solution for each sub problem. You would also need to memrize solutions for each sub problem - O(m).
  
  Time complexity: O(m * n)<br>
  Space Complexity: O(m)

## Unit Tests
 Use the command 'npm test' to run test cases. Used Mocha + Chai to implement tests.<br>
 Due to time constraints, UI tests have not been implemented. However , backened should have good coverage.
  
## Tech stack

- Backend
  - Node + Express 
  - In memory sqllite database
  - Sequelize ORM

- Frontend
  - React

- Unit Tecting
  - chai
  - Mocha







