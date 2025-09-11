const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true,
      index: true, // For faster queries by recipe
    },
    userId: {
      type: String,
      required: true,
      index: true, // For faster queries by user
    },
    username: {
      type: String,
      required: true,
      // Denormalized for performance - avoid joins
    },
    comment: {
      type: String,
      required: true,
      maxLength: 1000, // Reasonable limit for comments
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    likes: [
      {
        type: String, // Array of user IDs who liked this comment
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Compound index for efficient pagination and sorting
commentSchema.index({ recipeId: 1, createdAt: -1 });

// Index for user's comments
commentSchema.index({ userId: 1, createdAt: -1 });

// Pre-save middleware to update the updatedAt field when edited
commentSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.isEdited = true;
    this.updatedAt = new Date();
  }
  next();
});

// Virtual for like count
commentSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Method to check if a user liked this comment
commentSchema.methods.isLikedByUser = function (userId) {
  return this.likes.includes(userId);
};

// Method to toggle like
commentSchema.methods.toggleLike = function (userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1); // Remove like
    return false; // User unliked
  } else {
    this.likes.push(userId); // Add like
    return true; // User liked
  }
};

// Ensure virtuals are included in JSON output
commentSchema.set("toJSON", { virtuals: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
