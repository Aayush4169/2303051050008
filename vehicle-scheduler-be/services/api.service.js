const axios = require("axios");
const { BASE_URL, ACCESS_TOKEN } = require("../config/env");
const Log = require("../../logging-middleware/logger");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

const getDepots = async () => {
  try {
    const response = await api.get("/depots");
    Log("backend", "info", "service", "Depots fetched");
    return response.data.depots || [];
  } catch (error) {
    Log("backend", "error", "service", error.message);
    throw new Error("Unable to fetch depots from upstream service");
  }
};

const getVehicles = async () => {
  try {
    const response = await api.get("/vehicles");
    Log("backend", "info", "service", "Vehicles fetched");
    return response.data.vehicles || [];
  } catch (error) {
    Log("backend", "error", "service", error.message);
    throw new Error("Unable to fetch vehicles from upstream service");
  }
};

module.exports = {
  getDepots,
  getVehicles,
};
