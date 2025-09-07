module.exports = (req, res, next) => {
  console.log("🔍 req.body before preprocess:", req.body);
  if (req.body.recipe && typeof req.body.recipe === "string") {
    try {
      const parsed = JSON.parse(req.body.recipe);
      req.body = { ...req.body, ...parsed };
      console.log("✅ req.body after preprocess:", req.body);
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
