/**
 *  Bank Note
 */
module.exports = function(sequelize, Sequalize) {
  let NoteSchema = sequelize.define("Note", {
    id: {
      type: Sequalize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: Sequalize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequalize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequalize.STRING,
      allowNull: false
    }
  });
  return NoteSchema;
}
