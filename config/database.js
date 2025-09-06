const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("recipes_db", "", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
