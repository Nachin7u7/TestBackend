import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import { Request, Response } from 'express';
import { SubmissionService } from '../services/submissionService';
import { SubmissionRepositoryImpl } from '../repositories/implements/submissionRepositoryImpl';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';

export class SubmissionController {

  private logger;

  constructor(private submissionService: SubmissionService) {
    this.submissionService = new SubmissionService(new SubmissionRepositoryImpl(), new ProblemRepositoryImpl(), new UserRepositoryImpl());
    this.logger = buildLogger('submissioControllers');

  };
  async userSubmissionsList (req: Request, res: Response) {
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
  };

  async compileAndRun(req: Request, res: Response) {
    try {
      this.logger.log('Compiling and running submission');
      const verdict = await this.submissionService.postSubmission(req);
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
}

