const express = require("express");
const { PORT } = require("./config/env");
const schedulerRoutes = require("./routes/scheduler.routes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(schedulerRoutes);
app.use("/api", schedulerRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
