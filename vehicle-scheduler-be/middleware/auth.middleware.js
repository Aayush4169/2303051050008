const { ACCESS_TOKEN } = require("../config/env");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (ACCESS_TOKEN && token !== ACCESS_TOKEN) {
    return res.status(401).json({ message: "invalid authorization token" });
  }

  return next();
};
