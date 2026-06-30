const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const loggingMiddleware = require("../middleware/logging.middleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  getDepotsHandler,
  getVehiclesHandler,
  getSchedule,
} = require("../controllers/scheduler.controller");

router.use(loggingMiddleware);
router.use(authMiddleware);

router.get("/depots", asyncHandler(getDepotsHandler));
router.get("/vehicles", asyncHandler(getVehiclesHandler));
router.get("/schedule", asyncHandler(getSchedule));

module.exports = router;
