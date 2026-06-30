const { getDepots, getVehicles } = require("../services/api.service");
const knapsack = require("../services/knapsack.service");
const Log = require("../../logging-middleware/logger");

const getDepotsHandler = async (_req, res) => {
  try {
    Log("backend", "info", "controller", "Fetching depots");
    const depots = await getDepots();
    res.json({ depots });
  } catch (error) {
    Log("backend", "error", "controller", error.message);
    res.status(502).json({ message: error.message });
  }
};

const getVehiclesHandler = async (_req, res) => {
  try {
    Log("backend", "info", "controller", "Fetching vehicles");
    const vehicles = await getVehicles();
    res.json({ vehicles });
  } catch (error) {
    Log("backend", "error", "controller", error.message);
    res.status(502).json({ message: error.message });
  }
};

const getSchedule = async (_req, res) => {
  try {
    Log("backend", "info", "controller", "Calculating schedules");
    const depots = await getDepots();
    const vehicles = await getVehicles();

    const result = depots.map((depot) => {
      const schedule = knapsack(depot.MechanicHours, vehicles);

      return {
        DepotID: depot.ID,
        MechanicHours: depot.MechanicHours,
        TotalImpact: schedule.totalImpact,
        TotalDuration: schedule.totalDuration,
        SelectedTasks: schedule.selectedTasks,
      };
    });

    res.json(result);
  } catch (error) {
    Log("backend", "error", "controller", error.message);
    res.status(502).json({ message: error.message });
  }
};

module.exports = {
  getDepotsHandler,
  getVehiclesHandler,
  getSchedule,
};
