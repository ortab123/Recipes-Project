const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("../utils/dataStore");

const allowedDifficulties = ["easy", "medium", "hard"];

async function getAll(req, res, next) {
  try {
    let recipes = await readData();

    const { difficulty, maxCookingTime, search } = req.query;

    if (difficulty && allowedDifficulties.includes(difficulty)) {
      recipes = recipes.filter((r) => r.difficulty === difficulty);
    }

    if (maxCookingTime) {
      const max = Number(maxCookingTime);
      if (!Number.isNaN(max)) {
        recipes = recipes.filter((r) => Number(r.cookingTime) <= max);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    res.json(recipes);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;
    const recipes = await readData();
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return next({ statusCode: 404, message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const recipes = await readData();
    const body = req.body;

    const newRecipe = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      ingredients: body.ingredients,
      instructions: body.instructions,
      cookingTime: body.cookingTime,
      servings: body.servings,
      difficulty: body.difficulty,
      rating: body.rating ?? null,
      createdAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);
    await writeData(recipes);

    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const body = req.body;
    const recipes = await readData();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1)
      return next({ statusCode: 404, message: "Recipe not found" });

    recipes[idx] = {
      ...recipes[idx],
      title: body.title,
      description: body.description,
      ingredients: body.ingredients,
      instructions: body.instructions,
      cookingTime: body.cookingTime,
      servings: body.servings,
      difficulty: body.difficulty,
      rating: body.rating ?? recipes[idx].rating,
    };

    await writeData(recipes);
    res.json(recipes[idx]);
  } catch (err) {
    next(err);
  }
}

async function updateRating(req, res, next) {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    if (rating === null || isNaN(Number(rating))) {
      return next({ statusCode: 400, message: "Rating must be a number" });
    }

    const recipes = await readData();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1)
      return next({ statusCode: 404, message: "Recipe not found" });

    recipes[idx].rating = Number(rating);
    await writeData(recipes);
    res.json({ message: "Rating updated", recipe: recipes[idx] });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    const recipes = await readData();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1)
      return next({ statusCode: 404, message: "Recipe not found" });
    recipes.splice(idx, 1);
    await writeData(recipes);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const recipes = await readData();
    const total = recipes.length;
    const avgCookingTime = total
      ? recipes.reduce((s, r) => s + Number(r.cookingTime), 0) / total
      : 0;

    const byDifficulty = recipes.reduce(
      (acc, r) => {
        acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 }
    );

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
