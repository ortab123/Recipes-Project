const { body, param, validationResult } = require("express-validator");

const allowedDifficulties = ["easy", "medium", "hard"];

const validateRecipe = [
  body("title")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("title 3-100 chars"),
  body("description")
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage("description 10-500 chars"),
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("ingredients must be an array with at least 1 item"),
  body("ingredients.*")
    .isString()
    .withMessage("each ingredient must be a string"),
  body("instructions")
    .isArray({ min: 1 })
    .withMessage("instructions must be an array with at least 1 item"),
  body("instructions.*")
    .isString()
    .withMessage("each instruction must be a string"),
  body("cookingTime")
    .isFloat({ gt: 0 })
    .withMessage("cookingTime must be a positive number")
    .toFloat(),
  body("servings")
    .isInt({ gt: 0 })
    .withMessage("servings must be positive integer")
    .toInt(),
  body("difficulty")
    .isIn(allowedDifficulties)
    .withMessage(`difficulty must be one of ${allowedDifficulties.join(",")}`),
  body("rating").optional().isFloat({ min: 0, max: 5 }).toFloat(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

const validateIdParam = [
  param("id").isUUID().withMessage("id must be a UUID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: "Invalid ID",
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = { validateRecipe, validateIdParam };
