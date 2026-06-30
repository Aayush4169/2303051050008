const Log = require("../../logging-middleware/logger");

const loggingMiddleware = (req, res, next) => {
  Log(
    "backend",
    "info",
    "middleware",
    `${req.method} ${req.originalUrl}`,
  ).finally(() => next());
};

module.exports = loggingMiddleware;
