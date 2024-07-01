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
import { savedProblemSchema } from '../middlewares/schemas/savedProblemSchema';
import UserService from '../services/userService';
import { sendCreatedResponse, sendOkResponse } from '../handlers/successHandler';
import { catchErrors } from '../handlers/errorHandler';
import { NotFoundError } from '../Errors/NotFoundError';
import { BadRequestError } from '../Errors/BadRequestError';
import { ValidationError } from '../Errors/ValidationError';
export class ProblemController {
  public router: Router;
  private logger;

  constructor(private problemServices: ProblemService, private userService: UserService) {
    this.router = Router();
    this.logger = buildLogger('problemController')
    this.routes()

  }
  async globalLeaderboard(req: Request, res: Response): Promise<any> {
    this.logger.log('Fetching global leaderboard');
    const leaderboard = await this.userService.getUsersSortedBySolvedProblems();
    this.logger.log('Global leaderboard fetched successfully');
    sendOkResponse(res, leaderboard, 'Global leaderboard fetched successfully');
  }

  async getProblemList(req: Request, res: Response): Promise<any> {
    this.logger.log('Fetching problems list');
    const problemsList = await this.problemServices.getProblems();
    this.logger.log('Problems list fetched successfully');
    sendOkResponse(res, problemsList, 'Problems list fetched successfully');
  }
  async getProblemData(req: Request, res: Response): Promise<any> {
    const problemId = Number(req.query.problemId as string);
    if (isNaN(problemId)) throw new BadRequestError("Invalid problem ID");
    this.logger.log(`Fetching problem data for ID: ${problemId}`);
    const problem = await this.problemServices.getProblemById(problemId);
    if (!problem) throw new NotFoundError("Problem with such id doesn't exist");
    this.logger.log(`Problem data fetched successfully for ID: ${problemId}`);
    sendOkResponse(res, problem, 'Problem data fetched successfully');
  }
  async getMyProblemsList(req: Request, res: Response): Promise<any> {
    const authorId = req.user.id;
    if (!authorId) throw new ValidationError("User ID is missing");
    this.logger.log(`Fetching problems for user with ID: ${authorId}`);
    const problems = await this.problemServices.getProblemsByAuthor(authorId);
    this.logger.log('Problems fetched successfully');
    sendOkResponse(res, problems, 'Problems fetched successfully');
  }
  async createNewProblem(req: Request, res: Response): Promise<any> {
    const userId = req.user.id;
    const { problemName }: CreateNewProblemDTO = req.body;
    if (!problemName) throw new ValidationError("Problem name is required");
    this.logger.log(`Creating problem for user with ID: ${userId}`);
    const problem = await this.problemServices.createProblem(userId, problemName);
    this.logger.log('Problem created successfully');
    sendCreatedResponse(res, 'Problem created successfully', problem);
  }
  async saveProblem(req: Request, res: Response): Promise<any> {
    const authorId = req.user.id;
    const { _id, saved, problemName }: SaveProblemDTO = req.body;
    if (!_id || !problemName) throw new ValidationError("Problem ID and name are required");
    this.logger.log(`Saving problem with ID: ${_id} for user with ID: ${authorId}`);
    await this.problemServices.saveProblemData(_id, authorId, saved, problemName);
    this.logger.log('Problem saved successfully');
    sendOkResponse(res, null, 'Problem saved successfully');
  }
  async saveAndPublishProblem(req: Request, res: Response): Promise<any> {
    const authorId = req.user.id;
    const { _id, published }: SaveAndPublishProblemDTO = req.body;
    if (!_id) throw new ValidationError("Problem ID is required");
    this.logger.log(`Saving and publishing problem with ID: ${_id} for user with ID: ${authorId}`);
    const problemUpdated = await this.problemServices.saveAndPublishProblemData(_id, authorId, published);
    this.logger.log('Problem saved and published successfully');
    sendOkResponse(res, problemUpdated, 'Problem saved and published successfully');
  }
  async getMyProblemData(req: Request, res: Response): Promise<any> {
    const authorId = req.user.id;
    const problemId = req.query.problemId as string;
    if (!problemId) throw new ValidationError("Problem ID is required");
    this.logger.log(`Fetching data for problem with ID: ${problemId} for user with ID: ${authorId}`);
    const problem = await this.problemServices.getProblemWithAuthor(problemId, authorId);
    if (!problem) throw new NotFoundError('Problem not found');
    this.logger.log('Problem data fetched successfully');
    sendOkResponse(res, problem, 'Problem data fetched successfully');
  }
  routes() {
    const validator = createValidator()

    
    this.router.get('/getProblemsList', catchErrors(this.getProblemList.bind(this)));
    this.router.get('/getMyProblems', userAuth, verifyPermissions('isAllowedToCreateProblem'), catchErrors(this.getMyProblemsList.bind(this)));
    this.router.get('/getProblemData', validator.query(problemIdSchema), catchErrors(this.getProblemData.bind(this)));
    this.router.get('/getAdminProblemData', validator.query(problemIdSchema), userAuth, verifyAdminIdMatch, verifyPermissions('isAllowedToCreateProblem'), catchErrors(this.getMyProblemData.bind(this)));
    this.router.post('/', createValidatorForSchema(newProblemSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), catchErrors(this.createNewProblem.bind(this)));
    this.router.post('/save', createValidatorForSchema(problemDataSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), catchErrors(this.saveProblem.bind(this)));
    this.router.post('/saveandpublish', createValidatorForSchema(savedProblemSchema), userAuth, verifyPermissions('isAllowedToCreateProblem'), catchErrors(this.saveAndPublishProblem.bind(this)));
    this.router.get('/globalLeaderboard', catchErrors(this.globalLeaderboard.bind(this)));
  }
}

