import { buildLogger } from '../plugin';
import { Request, Response, Router } from 'express';
import { validateRegisterInput, verifyPermissions, userAuth } from '../middlewares';
import { services } from '../services';
import UserService from '../services/userService';
import { catchErrors } from '../handlers/errorHandler';
import { sendCreatedResponse } from '../handlers/successHandler';


export class UserController {
  private logger;
  public router: Router;

  constructor(private usersevice :UserService ) {
    this.router = Router();
    this.logger = buildLogger('userController');
    this.routes();
  }

  async register(req: Request, res: Response): Promise<any> {
    const { username, email, password } = req.body;
    this.logger.log('Registering new user:', { username, email });
    const newUSer = await this.usersevice.registerUser({ username, email, password });
    this.logger.log('User registered successfully');
    return sendCreatedResponse(res, "Your account has been created successfully.", newUSer);
  }

  async registerAdmin(req: Request, res: Response): Promise<any> {
    const { username, email, password } = req.body;
    this.logger.log('Registering new admin user:', { username, email });
    const newAdminUser = await this.usersevice.registerAdminUser({ username, email, password });
    this.logger.log('Admin user registered successfully');
    return sendCreatedResponse(res, "A new Admin account has been created successfully.", newAdminUser);
  }

  routes() {
    this.router.post('/register', validateRegisterInput, catchErrors(this.register.bind(this)));
    this.router.post(
      '/create-admin',
      userAuth,
      verifyPermissions('isAllowedToCreateAdmin'),
      validateRegisterInput,
      catchErrors(this.registerAdmin.bind(this)))
    ;
  }
}
