const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Recipe = require("./recipe");

const UserFavorite = sequelize.define(
  "UserFavorite",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "user_favorites",
    timestamps: true,
  }
);

User.belongsToMany(Recipe, { through: UserFavorite, foreignKey: "userId" });
Recipe.belongsToMany(User, { through: UserFavorite, foreignKey: "recipeId" });

module.exports = UserFavorite;
