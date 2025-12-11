// api.js
const axios = require("axios");

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = Api;

// http://127.0.0.1:8000/
