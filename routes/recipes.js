const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/recipesController");
const {
  validateRecipe,
  validateIdParam,
} = require("../middlewares/validators");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
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
  authMiddleware,
  upload.single("image"),
  preprocessRecipe,
  validateIdParam,
  validateRecipe,
  ctrl.update
);

// PATCH + DELETE
router.patch("/:id/rating", authMiddleware, ctrl.updateRating);
router.delete("/:id", authMiddleware, validateIdParam, ctrl.remove);

module.exports = router;
