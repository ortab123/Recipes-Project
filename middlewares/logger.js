function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
  });

  next();
}

module.exports = { logger };
