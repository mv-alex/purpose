const Sequelize = require("sequelize");
const db = {
  database: "purpose_sq",
  username: "alex",
  password: "12345",
};
const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});

module.exports = sequelize;
