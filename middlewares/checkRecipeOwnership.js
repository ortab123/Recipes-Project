const Recipe = require("../sql_models/recipe");

async function checkRecipeOwnership(req, res, next) {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    console.log("🔍 checkRecipeOwnership - recipeId:", recipeId);
    console.log("🔍 checkRecipeOwnership - userId:", userId);

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return next({
        statusCode: 404,
        message: "Recipe not found",
      });
    }

    console.log("🔍 Recipe found - recipe.userId:", recipe.userId);
    console.log("🔍 Current user ID:", userId);
    console.log("🔍 Are they equal?", recipe.userId === userId);

    if (recipe.userId !== userId) {
      console.log("🚫 Access denied - different user");
      return next({
        statusCode: 403,
        message: "You don't have permission to modify this recipe",
      });
    }

    req.recipe = recipe;
    next();
  } catch (err) {
    console.log("💥 Error in checkRecipeOwnership:", err);

    next(err);
  }
}

module.exports = checkRecipeOwnership;
