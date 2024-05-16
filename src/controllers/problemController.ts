import { createValidator } from 'express-joi-validation';
import { HTTP_STATUS } from '../constants';
import { buildLogger } from '../plugin';
import { ProblemService } from '../services/problemService';
import { Request, Response, Router } from 'express';
import { userAuth, verifyAdminIdMatch, verifyPermissions } from '../middlewares';
import { CreateNewProblemDTO } from '../dtos/createNewProblemDto';
import { SaveAndPublishProblemDTO } from '../dtos/saveAndPublishProblemDto';
import { SaveProblemDTO } from '../dtos/saveProblemDto';
import { createValidatorForSchema } from '../middlewares/schemaValidator';
import problemIdSchema from '../middlewares/schemas/problemIdSchema';
import { newProblemSchema } from '../middlewares/schemas/newProblemSchema';
import { problemDataSchema } from '../middlewares/schemas/problemDataSchema';
import { services } from '../services';

const { getUsersSortedBySolvedProblems } = services
export class ProblemController {
  public router: Router;
  private logger;
  


  constructor(private problemServices: ProblemService) {
    this.router = Router();
    this.logger = buildLogger('problemController')
    this.routes()

  }
  async globalLeaderboard(req: Request, res: Response): Promise<any> {
    try {
      this.logger.log('Fetching global leaderboard');
      const leaderboard = await getUsersSortedBySolvedProblems();
      this.logger.log('Global leaderboard fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        leaderboard: [],
      });
    } catch (err: any) {
      this.logger.error('Error fetching global leaderboard:', { error: err.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error. Please try again.',
      });
    }
  }

  async getProblemList(req: Request, res: Response): Promise<any> {
    try {
      this.logger.log('Fetching problems list');
      const problemsList = await this.problemServices.getProblems();
      this.logger.log('Problems list fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: problemsList,
      });
    } catch (err: any) {
      this.logger.error(`Error getting problems list: ${err}`);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Unable to retrieve problems list. Please try again later.',
      });
    }
  }
  async getProblemData(req: Request, res: Response): Promise<any> {
    const problemId = parseInt(req.query.problemId as string, 10);
    try {
      this.logger.log(`Fetching problem data for ID: ${problemId}`);
      const problem = await this.problemServices.getProblemById(problemId);
      this.logger.log(`Problem data fetched successfully for ID: ${problemId}`);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: problem,
      });
    } catch (err: any) {
      this.logger.error(`Error getting problem data for ID ${problemId}: ${err}`);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error. Please try again.',
      });
    }
  }
  async getMyProblemsList(req: Request, res: Response): Promise<any> {
    try {
      const authorId = req.user.id;
      this.logger.log(`Fetching problems for user with ID: ${authorId}`);
      const problems = await this.problemServices.getProblemsByAuthor(authorId);
      this.logger.log('Problems fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: problems,
      });
    } catch (error: any) {
      this.logger.error('Error fetching user problems:', { error: error.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async createNewProblem(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id;
      const { problemName }: CreateNewProblemDTO = req.body;
      this.logger.log(`Creating problem for user with ID: ${userId}`);
      const problem = await this.problemServices.createProblem(userId, problemName);
      this.logger.log('Problem created successfully');
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Problem created successfully',
        data: problem,
      });
    } catch (error: any) {
      this.logger.error('Error creating problem:', { error: error.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  async saveProblem(req: Request, res: Response): Promise<any> {
    try {
      const authorId = req.user.id;
      const { _id, problem }: SaveProblemDTO = req.body;
      this.logger.log(`Saving problem with ID: ${_id} for user with ID: ${authorId}`);
      await this.problemServices.saveProblemData(_id, authorId, problem);
      this.logger.log('Problem saved successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Problem saved successfully',
      });
    } catch (error: any) {
      this.logger.error('Error saving problem:', { error: error.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async saveAndPublishProblem(req: Request, res: Response): Promise<any> {
    try {
      const authorId = req.user.id;
      const { _id, problem }: SaveAndPublishProblemDTO = req.body;
      this.logger.log(`Saving and publishing problem with ID: ${_id} for user with ID: ${authorId}`);
      const problemUpdated = await this.problemServices.saveAndPublishProblemData(_id, authorId, problem);
      this.logger.log('Problem saved and published successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: problemUpdated,
        message: 'Problem saved and published successfully',
      });
    } catch (error: any) {
      this.logger.error('Error saving and publishing problem:', { error: error.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMyProblemData(req: Request, res: Response): Promise<any> {
    try {
      const authorId = req.user.id;
      const problemId = parseInt(req.query.problemId as string, 10);
      this.logger.log(`Fetching data for problem with ID: ${problemId} for user with ID: ${authorId}`);
      const problem = await this.problemServices.getProblemWithAuthor(problemId, authorId);
      if (!problem) {
        this.logger.log(`Problem not found with ID: ${problemId}`);
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Problem not found',
        });
      }
      this.logger.log('Problem data fetched successfully');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: problem,
      });
    } catch (error: any) {
      this.logger.error('Error fetching problem data:', { error: error.message });
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  routes() {
    const validator = createValidator()

    this.router.get('/getProblemsList', this.getProblemList.bind(this));
    this.router.get('/getMyProblems', userAuth, verifyPermissions('isAllowedToCreateProblem'), this.getMyProblemsList.bind(this));
    this.router.get('/getProblemData', validator.query(problemIdSchema), this.getProblemData.bind(this));
    this.router.get('/getAdminProblemData', validator.query(problemIdSchema), userAuth, verifyAdminIdMatch, verifyPermissions('isAllowedToCreateProblem'), this.getMyProblemData.bind(this));
    this.router.post('/', createValidatorForSchema(newProblemSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), this.createNewProblem.bind(this));
    this.router.post('/save', createValidatorForSchema(problemDataSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), this.saveProblem.bind(this));
    this.router.post('/saveandpublish', createValidatorForSchema(problemDataSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), this.saveAndPublishProblem.bind(this));
    this.router.get('/globalLeaderboard', this.globalLeaderboard.bind(this));
  }
}

