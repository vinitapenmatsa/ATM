const withdraw = require('../service/withdrawal');

describe('Test withdrawal Helper Functions',function(){

  it('Test get current cash pool',function(done){

      withdraw.utilities.getCashPool().then((result) => {
        console.log(result);
        done();
      });


  })

})
