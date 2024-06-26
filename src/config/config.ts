import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_SERVER_PORT = 5555;
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_CLIENT_URL = 'http://localhost:3000';
const DEFAULT_SERVER_URL = 'http://localhost:5555';

interface Config {
  env: string;
  server: {
    port: number;
    url: string;
  };
  client: {
    url: string;
  };
  email: {
    user: string | undefined;
    pass: string | undefined;
    service: string | undefined;
    serviceProvider: string | undefined;
  };
  mongoDB: {
    uri: string | undefined;
    database: string | undefined;
  };
  jdoodle: {
    clientId: string | undefined;
    clientSecret: string | undefined;
    url: string | undefined;
    credentials: Array<{
      clientId: string | undefined;
      clientSecret: string | undefined;
    }>;
  };
  passport: {
    sessionSecret: string | undefined;
    tokenSecret: string | undefined;
  };
  jwt: {
    tokenSecret: string | undefined;
    tokenExpireIn: string;
    accessTokenExpireIn: string;
    refreshTokenExpireIn: string;
  };
  allowedOrigins: string[];
}

function validateConfig(config: Config): void {
  const requiredVariables = [
    'DB_HOST',
    'DB_NAME',
    'EMAIL_USER',
    'EMAIL_PASS',
    'JDOODLE_CLIENT_ID',
    'JDOODLE_CLIENT_SECRET',
    'SESSION_SECRET',
    'TOKEN_SECRET',
  ];

  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is not set.`);
    }
  });
}

const config: Config = {
  env: process.env.NODE_ENV || DEFAULT_NODE_ENV,
  server: {
    port: parseInt(process.env.SERVER_PORT || '', 10) || DEFAULT_SERVER_PORT,
    url: process.env.SERVER_URL || DEFAULT_SERVER_URL,
  },
  client: {
    url: process.env.CLIENT_URL || DEFAULT_CLIENT_URL,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    service: process.env.EMAIL_SERVICE,
    serviceProvider: process.env.EMAIL_PROVIDER,
  },
  mongoDB: {
    uri: process.env.DB_HOST,
    database: process.env.DB_NAME,
  },
  jdoodle: {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    url: process.env.JDOODLE_URL,
    credentials: [
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      },
    ],
  },
  passport: {
    sessionSecret: process.env.SESSION_SECRET,
    tokenSecret: process.env.TOKEN_SECRET,
  },
  jwt: {
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpireIn: process.env.TOKEN_EXPIRES_IN || '1h',
    accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
    refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  allowedOrigins: [process.env.CLIENT_URL || '']
};

validateConfig(config);

export default config;
