const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const authMiddleware = require("../middlewares/authMiddleware");
const { param, validationResult } = require("express-validator");

// Validation middleware for recipeId
const validateRecipeId = [
  param("recipeId").isUUID().withMessage("recipeId must be a valid UUID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: "Invalid recipe ID",
        details: errors.array(),
      });
    }
    next();
  },
];

router.use(authMiddleware);

router.get("/", favoritesController.getFavorites);

router.post("/:recipeId", validateRecipeId, favoritesController.addToFavorites);

router.delete(
  "/:recipeId",
  validateRecipeId,
  favoritesController.removeFromFavorites
);

module.exports = router;
