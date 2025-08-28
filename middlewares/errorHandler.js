function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: true,
    message: err.message || "Server error",
    statusCode: err.statusCode || 500,
  });
}

module.exports = { errorHandler };
