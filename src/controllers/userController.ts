import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import { Request, Response, Router } from 'express';
import { validateRegisterInput, verifyPermissions, userAuth } from '../middlewares';
import { services } from '../services';
import UserService from '../services/userService';


export class UserController {
  private logger;
  public router: Router;

  constructor(private usersevice :UserService ) {
    this.router = Router();
    this.logger = buildLogger('userController');
    this.routes();
  }

  async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password } = req.body;
      this.logger.log('Registering new user:', { username, email });
      await this.usersevice.registerUser({ username, email, password });
      this.logger.log('User registered successfully');
      return res.status(HTTP_STATUS.CREATED).json({
        message: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      this.logger.error('Error registering user:', { error: error.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  async registerAdmin(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password } = req.body;
      this.logger.log('Registering new admin user:', { username, email });
      await this.usersevice.registerAdminUser({ username, email, password });
      this.logger.log('Admin user registered successfully');
      return res.status(HTTP_STATUS.CREATED).json({
        message: 'A new ADMIN account has been created successfully.',
      });
    } catch (error: any) {
      this.logger.error('Error registering admin user:', { error: error.message });
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: error.message,
      });
    }
  }

  routes() {
    this.router.post('/register', validateRegisterInput, this.register.bind(this));
    this.router.post(
      '/create-admin',
      userAuth,
      verifyPermissions('isAllowedToCreateAdmin'),
      validateRegisterInput,
      this.registerAdmin.bind(this)
    );
  }
}
