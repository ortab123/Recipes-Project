const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");
const limiter = require("./middlewares/rateLimiter");

// Routes
const recipesRouter = require("./routes/recipes");
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const commentsRouter = require("./routes/comments");

// SQL Database (existing)
const sequelize = require("./config/database");
const User = require("./sql_models/user");
const Recipe = require("./sql_models/recipe");
const UserFavorite = require("./sql_models/userFavorites");

// MongoDB Database (new)
const { connectMongoDB } = require("./config/mongodb");

// Initialize databases
async function initializeDatabases() {
  try {
    // SQL Database connection and sync
    await sequelize.authenticate();
    console.log("✅ SQL Connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("✅ All SQL models synchronized successfully.");

    // MongoDB connection
    await connectMongoDB();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    process.exit(1);
  }
}

// Initialize databases
initializeDatabases();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
// 🔑 Auth routes
app.use("/api/auth", authRouter);

// 🍲 Recipes routes
app.use("/api/recipes", limiter);
app.use("/api/recipes", recipesRouter);

// ⭐ Favorites routes
app.use("/api/users/favorites", favoritesRouter);

// 💬 Comments routes
app.use("/api", commentsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    sql: sequelize.authenticate ? "connected" : "disconnected",
    mongodb:
      require("mongoose").connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// 🛑 Error handling
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
