const axios = require('axios');
const { config } = require('../config');
const { jdoodle } = config;

const jdoodleAxios = axios.create({
  baseURL: jdoodle.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = jdoodleAxios;
