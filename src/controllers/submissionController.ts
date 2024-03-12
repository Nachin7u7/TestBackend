import { buildLogger } from '../plugin';
import { HTTP_STATUS } from '../constants';
import { services } from '../services';

const {getUsernameProblemIdSubmissions, getAcceptedProblemIdSubmissions, postSubmission} = services;

const logger = buildLogger('submissioControllers');

const userSubmissionsList = async (req: any, res: any): Promise<any> => {
  try {
    logger.log('Fetching user submissions list');
    const { username, problemId } = req.query; // Using 'as any' to bypass TypeScript's type checking
    const submissionsList = await getUsernameProblemIdSubmissions(username, problemId);
    logger.log('User submissions list fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      submissionsList,
    });
  } catch (err: any) {
    logger.error('Error fetching user submissions list:', { error: err.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const leaderboardProblemSubmissionsList = async (req: any, res: any): Promise<any> => {
  try {
    const { problemId } = req.query;
    logger.log('Fetching leaderboard problem submissions list');

    const submissions = await getAcceptedProblemIdSubmissions(problemId);
    logger.log('Leaderboard problem submissions list fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      leaderboard: submissions,
    });
  } catch (err: any) {
    logger.error('Error fetching leaderboard problem submissions list:', { error: err.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

const compileAndRun = async (req: any, res: any): Promise<any> => {
  try {
    logger.log('Compiling and running submission');
    const verdict = await postSubmission(req);
    logger.log('Submission compiled and run successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      verdict,
    });
  } catch (err: any) {
    logger.error('Error compiling and running submission:', { error: err.message });
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};


export {
  userSubmissionsList,
  leaderboardProblemSubmissionsList,
  compileAndRun,
};


