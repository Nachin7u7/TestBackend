const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { config } = require('./config');
const { buildLogger } = require('./plugin');
const routes = require('./api/routes');
const mongoConnectionInit = require('./config/dataSource');
const configurePassport = require('./config/passportConfig');

const logger = buildLogger('server.js');
const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const { server, env } = config;
const { port } = server;

const corsOptions =
  env === 'production'
    ? {
        origin: config.client,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      }
    : {
        origin: '*',
        methods: '*',
        credentials: true,
      };

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

configurePassport(app);

app.use('/api/v1', routes);

mongoConnectionInit()
  .then(() => {
    const { port } = config.server;
    app.listen(port, () => {
      logger.log(`Server is running on port ${port} - ${env}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });
