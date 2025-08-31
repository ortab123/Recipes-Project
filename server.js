const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");
const limiter = require("./middlewares/rateLimiter");
const recipesRouter = require("./routes/recipes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/recipes", limiter);

app.use("/api/recipes", recipesRouter);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
