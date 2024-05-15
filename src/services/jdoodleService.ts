import { jdoodleAxios } from '../api';
import { buildLogger } from '../plugin';
import { config } from '../config';

class JdoodleService {
  private credentialIndex: number = 0;
  private logger = buildLogger('JdoodleService');
  private jdoodleCredentials = config.jdoodle.credentials;

  private getNextCredentials() {
    const credentials = this.jdoodleCredentials[this.credentialIndex % this.jdoodleCredentials.length];
    this.credentialIndex++;
    return credentials;
  }

  async compileAndRun(program: any): Promise<any> {
    const { clientId, clientSecret } = this.getNextCredentials();
    const payload = {
      ...program,
      clientId,
      clientSecret,
    };

    this.logger.log('Attempting to compile and run the program.');

    try {
      const response = await jdoodleAxios.post('/execute', payload);
      this.logger.log('Successfully executed program with Jdoodle.', response.data);
      return { success: true, body: response.data };
    } catch (error: any) {
      this.logger.error('Failed to execute program with Jdoodle.', {
        error: error.message,
      });
      throw new Error('Failed to execute program with Jdoodle: ' + error.message);
    }
  }
}

export { JdoodleService };
