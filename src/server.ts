import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import { config, mongoConnectionInit, configurePassport } from './config';
import { buildLogger } from './plugin';
import routes from './api/routes';

const logger = buildLogger('server.ts');
const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


app.use(limiter);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

configurePassport(app);

app.use('/api/v1', routes);
app.get('/', (req, res) => {
  res.send('Server is running');
});

const { server, env } = config;
const { port } = server;

mongoConnectionInit()
  .then(() => app.listen(port, () => logger.log(`Server is running on port ${port} - ${env}`)))
  .catch((error: any) => logger.error('Unable to connect to the database:', error));