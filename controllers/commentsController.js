const Comment = require("../mongodb_models/Comment");
const Recipe = require("../sql_models/recipe"); // SQL model
const User = require("../sql_models/user"); // SQL model

// POST /api/recipes/:id/comments
async function createComment(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id;

    // Validate that recipe exists in SQL database
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return next({ statusCode: 404, message: "Recipe not found" });
    }

    // Get user info for denormalization
    const user = await User.findByPk(userId);
    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    // Create comment in MongoDB
    const newComment = new Comment({
      recipeId,
      userId,
      username: user.username, // Denormalized for performance
      comment,
      rating,
      likes: [],
      isEdited: false,
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: savedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    next(error);
  }
}

// GET /api/recipes/:id/comments
async function getRecipeComments(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate that recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return next({ statusCode: 404, message: "Recipe not found" });
    }

    // Get comments with pagination
    const comments = await Comment.find({ recipeId })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalComments = await Comment.countDocuments({ recipeId });

    // Calculate aggregate rating
    const ratingStats = await Comment.aggregate([
      { $match: { recipeId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    // Calculate rating distribution
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratingStats.length > 0) {
      ratingStats[0].ratingDistribution.forEach((rating) => {
        ratingDistribution[rating]++;
      });
    }

    const response = {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNext: page < Math.ceil(totalComments / limit),
        hasPrev: page > 1,
      },
      aggregateRating:
        ratingStats.length > 0
          ? {
              average: Math.round(ratingStats[0].averageRating * 100) / 100,
              total: ratingStats[0].totalRatings,
              distribution: ratingDistribution,
            }
          : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching comments:", error);
    next(error);
  }
}

// PUT /api/comments/:commentId
async function updateComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id;

    // Find the comment
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return next({ statusCode: 404, message: "Comment not found" });
    }

    // Check ownership
    if (existingComment.userId !== userId) {
      return next({
        statusCode: 403,
        message: "Not authorized to edit this comment",
      });
    }

    // Update comment
    existingComment.comment = comment;
    existingComment.rating = rating;
    // isEdited and updatedAt will be set by pre-save middleware

    const updatedComment = await existingComment.save();

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    next(error);
  }
}

// POST /api/comments/:commentId/like
async function toggleCommentLike(req, res, next) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next({ statusCode: 404, message: "Comment not found" });
    }

    const isLiked = comment.toggleLike(userId);
    await comment.save();

    res.json({
      message: isLiked ? "Comment liked" : "Comment unliked",
      isLiked,
      likeCount: comment.likeCount,
    });
  } catch (error) {
    console.error("Error toggling comment like:", error);
    next(error);
  }
}

// DELETE /api/comments/:commentId
async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next({ statusCode: 404, message: "Comment not found" });
    }

    // Check ownership
    if (comment.userId !== userId) {
      return next({
        statusCode: 403,
        message: "Not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    next(error);
  }
}

module.exports = {
  createComment,
  getRecipeComments,
  updateComment,
  toggleCommentLike,
  deleteComment,
};
