"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("recipes", "description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("recipes", "cookingTime", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("recipes", "servings", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("recipes", "difficulty", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("recipes", "rating", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("recipes", "imageUrl", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("recipes", "description");
    await queryInterface.removeColumn("recipes", "cookingTime");
    await queryInterface.removeColumn("recipes", "servings");
    await queryInterface.removeColumn("recipes", "difficulty");
    await queryInterface.removeColumn("recipes", "rating");
    await queryInterface.removeColumn("recipes", "imageUrl");
  },
};
