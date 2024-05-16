
import { services } from '../services';
import { Router, Request, Response } from 'express';
import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import {
  validateRegisterInput,
  verifyPermissions,
  userAuth,
} from '../middlewares';
//const{
//getUsersSortedBysolvedProblems,
//registerUser,
//registerAdminUser
//}=services;

export class UserController {
  public logger;
  public router: Router;
  private userService;

  constructor() {
    this.router = Router();
    this.logger = buildLogger('userController');
    this.userService = services;
  }

  async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password } = req.body;
      this.logger.log('Registering new user:', { username, email });
      await this.userService.registerAdminUser({ username, email, password });
      this.logger.log('User registered successfully');
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      this.logger.error('Error registering user:', error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  async registerAdmin(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password } = req.body;
      this.logger.log('Registering new admin user:', { username, email });
      await this.userService.registerAdminUser({ username, email, password });
      this.logger.log('Admin user registered successfully');
      res.status(HTTP_STATUS.CREATED).json({
        message: 'A new ADMIN account has been created successfully.',
      });
    } catch (error: any) {
      this.logger.error('Error registering admin user:', error);
      res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
    }
  };
  routes() {
    //! -------- NORMAL USERS ROUTES --------
    this.router.post('/register', validateRegisterInput, this.register);

    //! -------- ADMIN USERS ROUTES --------
    this.router.post(
      '/create-admin',
      userAuth,
      verifyPermissions('isAllowedToCreateAdmin'),
      validateRegisterInput,
      this.registerAdmin
    );
  }

}



