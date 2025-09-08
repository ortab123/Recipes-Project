const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");
const limiter = require("./middlewares/rateLimiter");
const recipesRouter = require("./routes/recipes");
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const sequelize = require("./config/database");
const User = require("./models/user");
const Recipe = require("./models/recipe");
const UserFavorite = require("./models/userFavorites");

sequelize
  .authenticate()
  .then(() => console.log("✅ Connection has been established successfully."))
  .catch((err) => console.error("❌ Unable to connect to the database:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ All models synchronized successfully."))
  .catch((err) => console.error("❌ Error syncing models:", err));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔑 Auth routes
app.use("/api/auth", authRouter);

// 🍲 Recipes routes
app.use("/api/recipes", limiter);
app.use("/api/recipes", recipesRouter);

// ⭐ Favorites routes
app.use("/api/users/favorites", favoritesRouter);

// 🛑 Error handling
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
