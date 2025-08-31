const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: true, message: "Too many requests", statusCode: 429 },
});

module.exports = limiter;
