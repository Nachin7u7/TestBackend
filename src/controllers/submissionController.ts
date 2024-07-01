import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import { Request, Response, Router, NextFunction } from 'express';
import { SubmissionService } from '../services/submissionService';
import { ProblemService } from '../services/problemService';
import { userAuth } from '../middlewares';
import { PostSubmissionDto } from '../dtos/postSubmissionDto';
import { validateBody } from '../middlewares/validateBody';
import { postSubmissionSchema } from '../middlewares/schemas/postSubmissionSchema';
import { sendOkResponse } from '../handlers/successHandler';
import { notFound,catchErrors } from '../handlers/errorHandler';
import { nextTick } from 'process';
import { BadRequestError } from '../Errors/BadRequestError';

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
    this.logger.log('Fetching user submissions list');
    const { username, problemId } = req.query; // Using 'as any' to bypass TypeScript's type checking
    const submissionsList = await this.submissionService.getUsernameProblemIdSubmissions(username, problemId);
    this.logger.log('User submissions list fetched successfully');
    return sendOkResponse(res,submissionsList,'User submissions list fetched successfully');
  };

  async leaderboardProblemSubmissionsList(req: Request, res: Response, next: NextFunction) {
    const { problemId } = req.query;
    this.logger.log('Fetching leaderboard problem submissions list');
    if (typeof problemId !== 'string' || problemId === undefined) {
      throw new BadRequestError('Invalid problemId');
    }  
   // Verificar si el problema existe
    const problemExists = await this.problemService.checkProblemExists(parseInt(problemId));
    if (!problemExists) {
      return notFound(req, res, next);
    }
    const submissions = await this.submissionService.getAcceptedProblemIdSubmissions(parseInt(problemId));
    this.logger.log('Leaderboard problem submissions list fetched successfully');
    return sendOkResponse(res,submissions,'Leaderboard problem submissions list fetched successfully');
  }

  async compileAndRun(req: Request, res: Response) {
    const postSubmissionDto: PostSubmissionDto = req.body;
    this.logger.log('Compiling and running submission');
    const verdict = await this.submissionService.postSubmission(req.user!, postSubmissionDto);
    this.logger.log('Submission compiled and run successfully');
    sendOkResponse(res, verdict, 'Submission compiled and run successfully');
  }

  routes() {
    this.router.post('/compileAndRun', userAuth, validateBody(postSubmissionSchema), catchErrors(this.compileAndRun.bind(this)));
    this.router.get('/submissionsList', userAuth, catchErrors(this.userSubmissionsList.bind(this)));
    this.router.get('/leaderboard',catchErrors(this.leaderboardProblemSubmissionsList.bind(this)));
  }
} 