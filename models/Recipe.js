const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Recipe = sequelize.define(
  "Recipe",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "recipes",
  }
);

Recipe.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Recipe, { foreignKey: "userId" });

module.exports = Recipe;
