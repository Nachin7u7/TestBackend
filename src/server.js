const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { config } = require('./config');
const { buildLogger } = require('./plugin');
const routes = require('./api/routes');
const mongoConnectionInit = require('./config/dataSource');
const configurePassport = require('./config/passportConfig');

const logger = buildLogger('server.js');

const app = express();
const { port } = config.server;

//! ----------- Init App Configurations ---------
//TODO: solo aplicar logs en dev env.
app.use(
  cors({
    origin: '*', // Allow to server to accept request from different origin.
    methods: '*',
    credentials: true, // Allow session cookie from browser to pass through.
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoConnectionInit();

app.use('/api/v1', routes);

configurePassport(app);

//! --------------- Listen to given PORT ---------------
app.listen(port, () => {
  logger.log(`Server is running on port ${port}`);
});
