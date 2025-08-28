const express = require("express");
const { logger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errorHandler");
const recipesRouter = require("./routes/recipes");

const app = express();
const PORT = 3000;

// JSON middleware
app.use(express.json());

// Logger middleware
app.use(logger);

// Routes
app.use("/api/recipes", recipesRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
