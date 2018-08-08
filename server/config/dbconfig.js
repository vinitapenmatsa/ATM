/* Load Modules */
let models = require("../model");

/* Account Data Setup */
let accountData = [{
    id: 1,
    accountNumber: 123456789,
    password: '0dc816468d963b162c608251dc5e615f05d5b04b8bf7898ac598f6acf5b09df2',
    pin: '03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4',
    firstName: 'bob',
    lastName: 'marley',
    balance: 3000
  },
  {
    id: 2,
    accountNumber: 123789456,
    password: '0dc816468d963b162c608251dc5e615f05d5b04b8bf7898ac598f6acf5b09df2',
    pin: '03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4',
    firstName: 'vinita',
    lastName: 'penmetsa',
    balance: 28545

  },
  {
    id: 3,
    accountNumber: 345621789,
    password: '0dc816468d963b162c608251dc5e615f05d5b04b8bf7898ac598f6acf5b09df2',
    pin: '03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4',
    firstName: 'david',
    lastName: 'brook',
    balance: 300

  },
  {
    id: 4,
    accountNumber: 123123123,
    password: '0dc816468d963b162c608251dc5e615f05d5b04b8bf7898ac598f6acf5b09df2',
    pin: '03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4',
    firstName: 'will',
    lastName: 'smith',
    balance: 99999999

  }
];

/* Bank Notes Setup */
let notesData = [{
    id: 1,
    value: 1000,
    quantity: 10,
    type: 'NOTE'
  },
  {
    id: 2,
    value: 500,
    quantity: 10,
    type: 'NOTE'
  },
  {
    id: 3,
    value: 200,
    quantity: 10,
    type: 'NOTE'
  },
  {
    id: 4,
    value: 100,
    quantity: 10,
    type: 'NOTE'
  },
  {
    id: 5,
    value: 50,
    quantity: 10,
    type: 'NOTE'
  },
  {
    id: 6,
    value: 20,
    quantity: 10,
    type: 'LARGE_COIN'
  },
  {
    id: 7,
    value: 10,
    quantity: 10,
    type: 'SMALL_COIN'
  },
  {
    id: 8,
    value: 5,
    quantity: 10,
    type: 'LARGE_COIN'
  },
  {
    id: 9,
    value: 2,
    quantity: 10,
    type: 'LARGE_COIN'
  },
  {
    id: 10,
    value: 1,
    quantity: 10,
    type: 'SMALL_COIN'
  }
];

//Sync Database
models.sequelize.sync().then(function() {
  /* Account insertion */
  models.Account.destroy({
    where: {}
  });
  models.Account.bulkCreate(accountData);

  /* Notes Date Insertion */
  models.Note.destroy({
    where: {}
  });
  models.Note.bulkCreate(notesData);

}).catch(function(err) {
  console.log(err)
});
