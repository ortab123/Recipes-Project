const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../middlewares/validators");
const {
  createComment,
  getRecipeComments,
  updateComment,
  toggleCommentLike,
  deleteComment,
} = require("../controllers/commentsController");

// Validation rules
const commentValidation = [
  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  handleValidationErrors,
];

const commentUpdateValidation = [
  body("comment")
    .optional()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  handleValidationErrors,
];

// Routes for comments attached to recipes
// POST /api/recipes/:id/comments
console.log("authMiddleware:", typeof authMiddleware);
console.log("handleValidationErrors:", typeof handleValidationErrors);
console.log("createComment:", typeof createComment);
router.post(
  "/recipes/:id/comments",
  authMiddleware,
  ...commentValidation,
  createComment
);

// GET /api/recipes/:id/comments
router.get("/recipes/:id/comments", getRecipeComments);

// Routes for specific comments
// PUT /api/comments/:commentId
router.put(
  "/comments/:commentId",
  authMiddleware,
  ...commentUpdateValidation,
  updateComment
);

// POST /api/comments/:commentId/like
router.post("/comments/:commentId/like", authMiddleware, toggleCommentLike);

// DELETE /api/comments/:commentId
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;
