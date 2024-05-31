import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import { Request, Response, Router } from 'express';
import { SubmissionService } from '../services/submissionService';
import { ProblemService } from '../services/problemService';
import { userAuth } from '../middlewares';
import { PostSubmissionDto } from '../dtos/postSubmissionDto';
import { validateBody } from '../middlewares/validateBody';
import { postSubmissionSchema } from '../middlewares/schemas/postSubmissionSchema';

export class SubmissionController {
  private logger;
  public router: Router;

  constructor(
    private submissionService: SubmissionService,
    private problemService: ProblemService 
  ) {
    this.router = Router();
    this.logger = buildLogger('submissionControllers');
    this.routes()
  };

  async userSubmissionsList(req: Request, res: Response) {
    try {
      this.logger.log('Fetching user submissions list');
      const { username, problemId } = req.query; // Using 'as any' to bypass TypeScript's type checking
      const submissionsList = await this.submissionService.getUsernameProblemIdSubmissions(username, problemId);
      this.logger.log('User submissions list fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        submissionsList,
      });
    } catch (err: any) {
      this.logger.error('Error fetching user submissions list:', { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error. Please try again.',
      });
    }
  };

  async leaderboardProblemSubmissionsList(req: Request, res: Response) {
    try {
      const { problemId } = req.query;
      this.logger.log('Fetching leaderboard problem submissions list');
      if (typeof problemId !== 'string' || problemId === undefined) {
        throw new Error('Invalid problemId');
      }

      // Verificar si el problema existe
      const problemExists = await this.problemService.checkProblemExists(parseInt(problemId));
      if (!problemExists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Problem not found',
        });
      }

      const submissions = await this.submissionService.getAcceptedProblemIdSubmissions(parseInt(problemId));
      this.logger.log('Leaderboard problem submissions list fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        leaderboard: submissions,
      });
    } catch (err: any) {
      this.logger.error('Error fetching leaderboard problem submissions list:', { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error. Please try again.',
      });
    }
  }

  async compileAndRun(req: Request, res: Response) {
    try {
      const postSubmissionDto: PostSubmissionDto = req.body;
      this.logger.log('Compiling and running submission');
      const verdict = await this.submissionService.postSubmission(req.user!, postSubmissionDto);
      this.logger.log('Submission compiled and run successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        verdict,
      });
    } catch (err: any) {
      this.logger.error('Error compiling and running submission:', { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error. Please try again.',
      });
    }
  };

  routes(){
    this.router.post('/compileAndRun', userAuth,validateBody(postSubmissionSchema), this.compileAndRun.bind(this));
  routes() {
    this.router.post('/compileAndRun', userAuth, this.compileAndRun.bind(this));
    this.router.get('/submissionsList', userAuth, this.userSubmissionsList.bind(this));
    this.router.get('/leaderboard', this.leaderboardProblemSubmissionsList.bind(this));
  }
}
