const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const expressApp = require('../../app');
const withdraw = require('../service/withdrawal');

const PORT = 4000;

let server = null;
const startApp = () => server = expressApp.listen(PORT);
const tearDown = () => server.close();

describe('Withdrawal Tests', function() {

  before(startApp);
  after(tearDown);

  describe('Withdrawal Amount Validations', function() {
    it('Test for invalid NAN withdrawal amount', function(done) {

      request(expressApp)
        .post('/withdraw')
        .send({
          amount: "teststring"
        })
        .expect('Content-Type', /json/)
        .expect('"Enter a valid withdrawal amount"')
        .expect(400, done);

    });

    it('Test for invalid 0 withdrawal amount', function(done) {
      request(expressApp)
        .post('/withdraw')
        .send({
          amount: 0
        })
        .expect('Content-Type', /json/)
        .expect('"Enter a valid withdrawal amount"')
        .expect(400, done);

    });

  });

  it('Test for insufficent account balance', function(done) {

      request(expressApp)
        .post('/withdraw')
        .send({
          accountNumber: 345621789,
          amount: 301

        })
        .expect('Content-Type', /json/)
        .expect('"Account does not have sufficient balance. Please try a smaller amount"')
        .expect(400, done);

  });

  it('Test for insufficient ATM cash', function(done) {

    request(expressApp)
      .post('/withdraw')
      .send({
        accountNumber: 345621789,
        amount: 99999999

      })
      .expect('Content-Type', /json/)
      .expect('"Account does not have sufficient balance. Please try a smaller amount"')
      .expect(400, done);

  });

  it('Test for Succesful Withdrawal', function(done) {

    request(expressApp)
      .post('/withdraw')
      .send({
        accountNumber: 123456789,
        amount: 220

      })
      .expect('Content-Type', /json/)
      .expect(200, done);

  });

});
