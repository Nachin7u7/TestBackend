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

  try {
    const response = await jdoodleAxios.post('/execute', payload);
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Failed to execute program with Jdoodle:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { compileAndRun };
