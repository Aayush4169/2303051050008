const { ACCESS_TOKEN } = require("../config/env");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token || token !== ACCESS_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};

module.exports = authMiddleware;
