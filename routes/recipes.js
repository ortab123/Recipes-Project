const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/recipesController");
const {
  validateRecipe,
  validateIdParam,
} = require("../middlewares/validators");

// CRUD
router.get("/", ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/:id", validateIdParam, ctrl.getById);
router.post("/", validateRecipe, ctrl.create);
router.put("/:id", validateIdParam, validateRecipe, ctrl.update);
router.delete("/:id", validateIdParam, ctrl.remove);

module.exports = router;
