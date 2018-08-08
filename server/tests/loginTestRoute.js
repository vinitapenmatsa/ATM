const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const expressApp = require('../../app');
const withdraw = require('../service/withdrawal');

const PORT = 4000;

let server = null;
const startApp = () => server = expressApp.listen(PORT);
const tearDown = () => server.close();

describe('Login Tests', function() {

  before(startApp);
  after(tearDown);

  describe('Account Validations', function() {

  it('Test for NAN Account Number', function(done) {

        request(expressApp)
          .post('/login')
          .send({
            accountNumber: "teststring"
          })
          .expect('Content-Type', /json/)
          .expect('"Account has to be a valid number"')
          .expect(400, done);

  });

  it('Test for invalid Account Number', function(done) {

      request(expressApp)
        .post('/login')
        .send({
          accountNumber: "123"
        })
        .expect('Content-Type', /json/)
        .expect('"Account Number must have 9 digits"')
        .expect(400, done);

  });

  it('Test for wrong Account Number', function(done) {

      request(expressApp)
        .post('/login')
        .send({
          accountNumber: "192837465"
        })
        .expect('Content-Type', /json/)
        .expect('"Account Number Not Found"')
        .expect(400, done);

  });

});

it('Test for Incorrect Password', function(done) {

    request(expressApp)
      .post('/login')
      .send({
        accountNumber: "123456789",
        password: 'test hash'
      })
      .expect('Content-Type', /json/)
      .expect('"Incorrect Password"')
      .expect(400, done);

});

it('Test successful login', function(done) {

    request(expressApp)
      .post('/login')
      .send({
        accountNumber: "123456789",
        password: 'coinifyaccount1'
      })
      .expect('Content-Type', /json/)
      .expect(200, done);

});

});
