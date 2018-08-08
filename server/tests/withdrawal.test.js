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

  it('Test greedy algorithm to get change',function(done){
    let result = withdraw.utilities.greedyAlgorithmToGetChange();
  });

  it('Test dp algorithm to get change',function(done){

  });

})
