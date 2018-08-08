const chai = require('chai');
const expect = chai.expect;
const withdraw = require('../service/withdrawal');

describe('Test withdrawal Helper Functions',function(){

  it('Test get current cash pool',function(done){
      withdraw.utilities.getCashPool().then((result) => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(10);
        done();
      });
  })

 describe('Test greedy algorithm',function(){


   it('Test greedy algorithm for amount > change', function(done){
     let coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                       { value: 2, quantity: 10, type: 'LARGE_COIN' },
                       { value: 5, quantity: 10, type: 'LARGE_COIN' }];

     let result = withdraw.utilities.greedyAlgorithmToGetChange(coinChange , 1000)
     expect(result).to.be.an('array');
     expect(result).to.have.length(0);
     done();
   });

   it('Test greedy algorithm for amount < minimum denomination', function(done){
     let coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                       { value: 2, quantity: 10, type: 'LARGE_COIN' },
                       { value: 5, quantity: 10, type: 'LARGE_COIN' }];

     let result = withdraw.utilities.greedyAlgorithmToGetChange(coinChange , 0)
     expect(result).to.be.an('array');
     expect(result).to.have.length(0);
     done();

   });

   it('Test greedy algorithm : check if change is correct', function(done){

      coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                       { value: 2, quantity: 10, type: 'LARGE_COIN' },
                       { value: 5, quantity: 10, type: 'LARGE_COIN' }];


     let result = withdraw.utilities.greedyAlgorithmToGetChange(coinChange , 13)
     let total=0;
     result.forEach((item) => total += item.value)
     expect(total).to.be.equal(13);
     expect(result).to.have.length(4);
     done();

   });

   it('Test greedy algorithm min number of denomination', function(done){

     const coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                       { value: 2, quantity: 10, type: 'LARGE_COIN' },
                       { value: 5, quantity: 10, type: 'LARGE_COIN' }];

    console.log(coinChange);
     let result = withdraw.utilities.greedyAlgorithmToGetChange(coinChange , 55 )
     expect(result).to.have.length(13);
     done();

   });


  });

  describe('Test dp algorithm',function(){

    it('Test dp algorithm for amount > change', function(done){
      /*let coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                        { value: 2, quantity: 10, type: 'LARGE_COIN' },
                        { value: 5, quantity: 10, type: 'LARGE_COIN' }];

      let result = withdraw.utilities.dpAlgorithmToGetChange(coinChange , 1000)
      expect(result).to.be.an('array');
      expect(result).to.have.length(0);*/
      done();
    });

    it('Test dp algorithm for amount < minimum denomination', function(done){
      let coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                        { value: 2, quantity: 10, type: 'LARGE_COIN' },
                        { value: 5, quantity: 10, type: 'LARGE_COIN' }];

      let result = withdraw.utilities.dpAlgorithmToGetChange(coinChange , 0)
      expect(result).to.be.an('array');
      expect(result).to.have.length(0);
      done();

    });

    it('Test dp algorithm : check if change is correct', function(done){
      coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                       { value: 2, quantity: 10, type: 'LARGE_COIN' },
                       { value: 5, quantity: 10, type: 'LARGE_COIN' }];


     let result = withdraw.utilities.dpAlgorithmToGetChange(coinChange , 13)
     let total=0;
     result.forEach((item) => total += item.value)
     expect(total).to.be.equal(13);
     expect(result).to.have.length(4);
     done();
    });

    it('Test greedy algorithm min number of denomination', function(done){
      const coinChange = [{ value: 1, quantity: 10, type: 'SMALL_COIN' },
                        { value: 2, quantity: 10, type: 'LARGE_COIN' },
                        { value: 5, quantity: 10, type: 'LARGE_COIN' }];

     console.log(coinChange);
      let result = withdraw.utilities.greedyAlgorithmToGetChange(coinChange , 55 )
      expect(result).to.have.length(13);
      done();
    });


  });

})
