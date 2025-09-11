const Recipe = require("../sql_models/recipe");
const { Op } = require("sequelize");

const allowedDifficulties = ["easy", "medium", "hard"];

// GET /api/recipes
async function getAll(req, res, next) {
  try {
    const { difficulty, maxCookingTime, search, minRating, sortBy, sortOrder } =
      req.query;

    const where = {};

    if (difficulty && allowedDifficulties.includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (maxCookingTime) {
      where.cookingTime = { [Op.lte]: Number(maxCookingTime) };
    }

    if (minRating) {
      where.rating = { [Op.gte]: Number(minRating) };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === "desc" ? "DESC" : "ASC"]);
    }

    const recipes = await Recipe.findAll({ where, order });
    res.json(recipes);
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/:id
async function getById(req, res, next) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return next({ statusCode: 404, message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

// POST /api/recipes
async function create(req, res, next) {
  try {
    console.log("🍲 req.body in create:", req.body);
    console.log("👤 req.user:", req.user);
    const body = req.body.recipe ? JSON.parse(req.body.recipe) : req.body;

    const newRecipe = await Recipe.create({
      title: body.title,
      description: body.description,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      cookingTime: body.cookingTime,
      servings: body.servings,
      difficulty: body.difficulty,
      rating: body.rating ?? null,
      imageUrl: req.file ? req.file.path : null,
      userId: req.user.id,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
}

// PUT /api/recipes/:id
async function update(req, res, next) {
  try {
    const body = req.body.recipe ? JSON.parse(req.body.recipe) : {};

    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return next({ statusCode: 404, message: "Recipe not found" });

    await recipe.update({
      title: body.title,
      description: body.description,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      cookingTime: body.cookingTime,
      servings: body.servings,
      difficulty: body.difficulty,
      rating: body.rating ?? recipe.rating,
      imageUrl: req.file ? req.file.path : recipe.imageUrl,
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/recipes/:id/rating
async function updateRating(req, res, next) {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating === null || isNaN(Number(rating))) {
      return next({ statusCode: 400, message: "Rating must be a number" });
    }

    const recipe = await Recipe.findByPk(id);
    if (!recipe) return next({ statusCode: 404, message: "Recipe not found" });

    recipe.rating = Number(rating);
    await recipe.save();

    res.json({ message: "Rating updated", recipe });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/recipes/:id
async function remove(req, res, next) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return next({ statusCode: 404, message: "Recipe not found" });

    await recipe.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/stats
async function getStats(req, res, next) {
  try {
    const recipes = await Recipe.findAll();
    const total = recipes.length;

    const avgCookingTime = total
      ? recipes.reduce((s, r) => s + (r.cookingTime || 0), 0) / total
      : 0;

    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    for (const r of recipes) {
      if (r.difficulty && byDifficulty[r.difficulty] !== undefined) {
        byDifficulty[r.difficulty]++;
      }
    }

    const ingredientCounts = {};
    for (const r of recipes) {
      (r.ingredients || []).forEach((i) => {
        const key = String(i).toLowerCase();
        ingredientCounts[key] = (ingredientCounts[key] || 0) + 1;
      });
    }

    const mostCommonIngredients = Object.entries(ingredientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ingredient, count]) => ({ ingredient, count }));

    res.json({
      total,
      avgCookingTime,
      byDifficulty,
      mostCommonIngredients,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getStats,
  updateRating,
};
