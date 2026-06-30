const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const BASE_URL =
  process.env.LOG_URL || "http://4.224.186.213/evaluation-service/logs";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function Log(stack, level, packageName, message) {
  if (!ACCESS_TOKEN) {
    return null;
  }

  try {
    const response = await axios.post(
      BASE_URL,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
}

module.exports = Log;
