import { services } from '../services';
import { HTTP_STATUS } from '../constants';
import { buildLogger } from '../plugin';
import { ProblemService } from '../services/problemService';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';
import { Router } from 'express';
import { userAuth, verifyPermissions } from '../middlewares';
import { submissionController, userController } from '.';


//const problemServices = new ProblemService(new ProblemRepositoryImpl);

export class ProblemController{
  public router: Router;
  private logger
  private problemServices: ProblemService;
  
  constructor(){
    this.router = Router();
    this.logger = buildLogger('problemController')
    this.problemServices = new ProblemService(new ProblemRepositoryImpl());
    this.routes()
  }
  
  async getProblemList (req: any, res: any): Promise<any>{
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
  async getProblemData (req: any, res: any): Promise<any>{
    const { problemId } = req.query;
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
  async getMyProblemsList (req: any, res: any): Promise<any>{
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
  async createNewProblem (req: any, res: any): Promise<any>{
    try {
      const userId = req.user.id;
      const { problemName } = req.body;
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
  async saveProblem (req: any, res: any): Promise<any>{
    try {
      const authorId = req.user.id;
      const { _id, problem } = req.body;
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
  async saveAndPublishProblem (req: any, res: any): Promise<any>{
    try {
      const authorId = req.user.id;
      const { _id, problem } = req.body;
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
  async getMyProblemData (req: any, res: any): Promise<any>{
    try {
      const authorId = req.user.id;
      const { problemId } = req.query;
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
  routes(){
    this.router.get('/getProblemsList', this.getProblemList.bind(this));
    this.router.get('/getMyProblems', userAuth, verifyPermissions('isAllowedToCreateProblem'), this.getMyProblemsList.bind(this));
    this.router.get('/getProblemData', this.getProblemData.bind(this));
    this.router.get('/getAdminProblemData',userAuth,verifyPermissions('isAllowedToCreateProblem'),this.getMyProblemData.bind(this));
    this.router.post('/',userAuth, verifyPermissions('isAllowedToCreateProblem'), this.createNewProblem.bind(this));
    this.router.post('/save', userAuth, verifyPermissions('isAllowedToCreateProblem'), this.saveProblem.bind(this));
    this.router.post('/saveandpublish', userAuth, verifyPermissions('isAllowedToCreateProblem'), this.saveAndPublishProblem.bind(this));
    this.router.post('/compileAndRun', userAuth,submissionController.compileAndRun.bind(this)); 
    this.router.get('/submissionsList', userAuth, submissionController.userSubmissionsList.bind(this)); 
    this.router.get('/leaderboard', submissionController.leaderboardProblemSubmissionsList.bind(this));
    this.router.get('/globalLeaderboard', userController.globalLeaderboard.bind(this));
  }
}
