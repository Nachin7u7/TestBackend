import { Request, Response, Router } from 'express';
import { buildLogger } from '../plugin';
import { successHandler } from '../handlers';
import { AuthService, verifyRefreshToken } from '../services/authService';
import { HTTP_STATUS } from '../constants';
import { userAuth, validateForgotPasswordInput, validateLoginInput, validateRefreshToken } from '../middlewares';
import { RefreshTokenDTO } from '../dtos/refreshTokenDto';
import { LoginDTO } from '../dtos/loginDto';
import { ForgotPasswordDTO } from '../dtos/forgotPasswordDto';
import UserService from '../services/userService';

export class AuthController{
  public router: Router
  private logger

  constructor(private authService: AuthService, private userService: UserService){
    this.router = Router()
    this.logger = buildLogger('authController')
    this.routes()
  }

  async refreshToken  (req: Request, res: Response): Promise<any> {
    try {
      this.logger.log('Refresh Token');
      const { token }: RefreshTokenDTO = req.body;
      const tokenResponse = await verifyRefreshToken(token);
      successHandler.sendOkResponse(res, tokenResponse, 'Token refreshed successfully');
    } catch (err: any) {
      this.logger.error("Error getting new Token: ${err}");
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Unable to retrieve token. Please try again later.',
      });
    }
  }
  async login (req: Request, res: Response): Promise<any> {
    try {
      const { username, password }: LoginDTO = req.body;
      this.logger.log('Attempting to log in user:', { user: username });
      const loginResponseData = await this.authService.authenticateUser(username, password);

      successHandler.sendOkResponse(
        res,
        loginResponseData,
        'Logged in successfully'
      );
    } catch (error: any) {
      this.logger.error('Login error', { error: error.message });
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: error.message });
    }
  }

  logout (req: Request, res: Response) {
    this.logger.log('User logged out successfully');
    successHandler.sendOkResponse(
      res,
      null,
      'Successfully logged out.' 
    )
  }


  checkAuthentication (req: Request, res: Response) {
    const { user } = req;
    if (user) {
      this.logger.log('User is authenticated:', { user: req.user });
      successHandler.sendOkResponse(
        res,
        { isAuthenticated: true,
          user: user },
        "User is authenticated"
      ) 
    } else {
      this.logger.log('User is not authenticated');
      successHandler.sendOkResponse(
        res,
        { isAuthenticated: false },
        "User is not authenticated"
      )
    }
  }

  async forgotPassword (req: Request, res: Response) {
    try {
      const { email }: ForgotPasswordDTO = req.body;
      this.logger.log('Forgot password request for email:', {email});
      await this.authService.sendForgotPasswordEmail(email);
      this.logger.log('Forgot password email sent successfully');
      successHandler.sendOkResponse(
        res,
        null,
        'Forgot password email sent successfully'
      );
    } catch (error: any) {
      this.logger.error('Error sending forgot password email:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to send email. Please try again.',
      });
    }
  }

  async resetPassword (req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      this.logger.log('Resetting password for token:', {token});
      await this.authService.resetUserPassword(token, password);
      this.logger.log('Password reset successfully');
      successHandler.sendOkResponse(res, null, 'Password reset successfully');
    } catch (error: any) {
      this.logger.error('Error resetting password:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to reset password. Please try again.',
      });
    }
  }

  async verifyEmail (req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.params;
      this.logger.log('Verifying email with token:', {token});
      const verifcationResult = await this.userService.checkTokenToMail(token);
      this.logger.log('Email verified successfully');

      successHandler.sendOkResponse(
        res, 
        null,
        'Email verified successfully. You can now login.' 
      )
    } catch (error: any) {
      this.logger.error('Error verifying email:', error);
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Failed to verify email. Invalid or expired token.' });
    }
  }

  routes(){
    this.router.post('/login', validateLoginInput, this.login.bind(this));
    this.router.get('/logout', this.logout.bind(this));
    this.router.get('/isLoggedIn', userAuth, this.checkAuthentication.bind(this));
    this.router.post('/forgot-password', validateForgotPasswordInput, this.forgotPassword.bind(this));
    this.router.post('/reset-password/:token', this.resetPassword.bind(this));
    this.router.get('/verify/:token', this.verifyEmail.bind(this));
    this.router.post('/refresh-token', validateRefreshToken, this.refreshToken.bind(this));
  }
}