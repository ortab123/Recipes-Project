const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/recipesController");
const {
  validateRecipe,
  validateIdParam,
} = require("../middlewares/validators");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
const checkRecipeOwnership = require("../middlewares/checkRecipeOwnership");
const preprocessRecipe = require("../middlewares/preprocessRecipe");

// GET
router.get("/", ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/:id", validateIdParam, ctrl.getById);

// POST + PUT
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  preprocessRecipe,
  validateRecipe,
  ctrl.create
);
router.put(
  "/:id",
  validateIdParam,
  authMiddleware,
  checkRecipeOwnership,
  upload.single("image"),
  preprocessRecipe,
  validateRecipe,
  ctrl.update
);

// PATCH + DELETE
router.patch(
  "/:id/rating",
  validateIdParam,
  authMiddleware,
  checkRecipeOwnership,
  ctrl.updateRating
);

router.delete(
  "/:id",
  validateIdParam,
  authMiddleware,
  checkRecipeOwnership,
  ctrl.remove
);

module.exports = router;
