// api.js
const axios = require("axios");

const Api = axios.create({
  baseURL: "https://server.jobaeralmahamud.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = Api;

// https://server.jobaeralmahamud.com/
