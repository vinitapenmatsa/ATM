const fs = require('fs');
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mainDB', null, null, {
  logging: false,
  dialect: "sqlite",
  storage: './test.sqlite',
});

var db = {};

fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
  let model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});


Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
