const User = require("../models/user");
const Recipe = require("../models/recipe");
const UserFavorite = require("../models/userFavorite");

exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Recipe,
          through: { attributes: [] },
          attributes: [
            "id",
            "title",
            "description",
            "imageUrl",
            "rating",
            "difficulty",
          ],
        },
      ],
    });

    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    res.json({
      success: true,
      favorites: user.Recipes || [],
    });
  } catch (err) {
    next(err);
  }
};

exports.addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return next({ statusCode: 404, message: "Recipe not found" });
    }

    const existingFavorite = await UserFavorite.findOne({
      where: { userId, recipeId },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Recipe already in favorites",
      });
    }

    await UserFavorite.create({ userId, recipeId });

    res.status(201).json({
      success: true,
      message: "Recipe added to favorites",
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const favorite = await UserFavorite.findOne({
      where: { userId, recipeId },
    });

    if (!favorite) {
      return next({
        statusCode: 404,
        message: "Recipe not found in favorites",
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: "Recipe removed from favorites",
    });
  } catch (err) {
    next(err);
  }
};
