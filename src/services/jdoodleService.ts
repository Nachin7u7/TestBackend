import { jdoodleAxios } from '../api';
import { buildLogger } from '../plugin';
import { config } from '../config';

const { jdoodle } = config;
const logger = buildLogger('JdoodleService');

let credentialIndex = 0;

const getNextCredentials = () => {
  const credentials = jdoodle.credentials[credentialIndex % jdoodle.credentials.length];
  credentialIndex++;
  return credentials;
};

const compileAndRun = async (program: any): Promise<any> => {
  const { clientId, clientSecret } = getNextCredentials();
  const payload = {
    ...program,
    clientId,
    clientSecret,
  };

  logger.log('Attempting to compile and run the program.');

  try {
    const response = await jdoodleAxios.post('/execute', payload);
    logger.log('Successfully executed program with Jdoodle.', response.data);
    return { success: true, body: response.data };
  } catch (error: any) {
    logger.error('Failed to execute program with Jdoodle.', {
      error: error.message,
    });
    throw new Error('Failed to execute program with Jdoodle: ' + error.message);
  }
};

export { compileAndRun };
