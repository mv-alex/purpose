const { DataTypes } = require("sequelize");
const sequelize = require("./../db");
const Purpose = require("./Purpose");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Purpose, {
  foreignKey: "userId",
});
Purpose.belongsTo(User);

module.exports = User;
