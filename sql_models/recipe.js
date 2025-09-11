const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("ingredients");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("ingredients", JSON.stringify(value));
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("instructions");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("instructions", JSON.stringify(value));
      },
    },
    cookingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "recipes",
  }
);

Recipe.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Recipe, { foreignKey: "userId" });

module.exports = Recipe;
