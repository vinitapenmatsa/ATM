/**
 *  Account
 */
module.exports = function(sequelize, Sequalize) {
  let AccountSchema = sequelize.define("Account", {
    id: {
      type: Sequalize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    accountNumber: {
      type: Sequalize.INTEGER,
      allowNull: false
    },
    password: {
      type: Sequalize.STRING,
      allowNull: false
    },
    pin: {
      type: Sequalize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequalize.STRING,
    },
    lastName: {
      type: Sequalize.STRING,
    },
    balance: {
      type: Sequalize.DECIMAL(10, 2),
      allowNull: false
    }
  });
  return AccountSchema;
}
