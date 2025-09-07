module.exports = (req, res, next) => {
  if (req.body.recipe && typeof req.body.recipe === "string") {
    try {
      const parsed = JSON.parse(req.body.recipe);
      req.body = { ...req.body, ...parsed };
    } catch (err) {
      return next({
        statusCode: 400,
        message: "Invalid JSON in 'recipe' field",
        details: err.message,
      });
    }
  }
  next();
};
