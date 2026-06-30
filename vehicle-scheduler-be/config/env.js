require("dotenv").config();

module.exports = {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  BASE_URL: process.env.BASE_URL,
  PORT: Number(process.env.PORT || 3000),
};
