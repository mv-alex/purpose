const { DataTypes } = require("sequelize");
const sequelize = require("./../db");
const Task = require("./Task");

const Purpose = sequelize.define("purpose", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
Purpose.hasMany(Task, {
  foreignKey: "purposeId",
});
Task.belongsTo(Purpose);

module.exports = Purpose;
