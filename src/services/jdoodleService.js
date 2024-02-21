const { jdoodleAxios } = require('../api');
const { buildLogger } = require('../plugin');
const { config } = require('../config');

const { jdoodle } = config;
const logger = buildLogger('JdoodleService');
let credentialIndex = 0;
const getNextCredentials = () => {
  const credentials =
    joodleCredentials[credentialIndex % jdoodle.credentials.length];
  credentialIndex++;
  return credentials;
};

const compileAndRun = async (program) => {
  const { clientId, clientSecret } = getNextCredentials();
  const payload = {
    ...program,
    clientId,
    clientSecret,
  };

  logger.log('Attempting to compile and run the program.');

  try {
    const response = await jdoodleAxios.post('/execute', payload);
    logger.log('Successfully compiled and ran the program.');
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Failed to execute program with Jdoodle.', {
      error: error.message,
    });
    throw new Error('Failed to execute program with Jdoodle: ' + error.message);
  }
};

module.exports = { compileAndRun };
