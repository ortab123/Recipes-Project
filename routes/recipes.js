const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/recipesController");
const {
  validateRecipe,
  validateIdParam,
} = require("../middlewares/validators");

router.get("/", ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/:id", validateIdParam, ctrl.getById);
router.post("/", validateRecipe, ctrl.create);
router.put("/:id", validateIdParam, validateRecipe, ctrl.update);
router.patch("/:id/rating", ctrl.updateRating);
router.delete("/:id", validateIdParam, ctrl.remove);

module.exports = router;
