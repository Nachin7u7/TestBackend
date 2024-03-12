import { Submission } from "../models";
import { buildLogger } from '../plugin';

const logger = buildLogger('submissionRepository');

const findUsernameProblemIdSubmissions = async (username: string, problemId: number): Promise<any> => {
  logger.log('Attempting to fetch submissions for the given username and problem id.', { username, problemId });
  try {
    const submissionsList = await Submission.find({
      username,
      problemId,
    });
    logger.log('Successfully fetched submissions for the given username and problem id.');
    return submissionsList;
  } catch (error: any) {
    logger.error('Error while fetching submissions for the given username and problem id.', {
      error: error.message,
      username,
      problemId
    });
    throw new Error(`Failed to fetch submissions for the given username and problem id: ${error.message}`);
  }
};

const findAcceptedProblemIdSubmissions = async (problemId: number): Promise<any> => {
  logger.log('Attempting to fetch accepted submissions for the given problem id.', { problemId });
  try {
    const submissions = await Submission.find({
      problemId,
      verdict: "Accepted!",
    });
    logger.log('Successfully fetched accepted submissions for the given problem id.');
    return submissions;
  } catch (error: any) {
    logger.error('Error while fetching accepted submissions for the given problem id.', {
      error: error.message,
      problemId
    });
    throw new Error(`Failed to fetch accepted submissions for the given problem id: ${error.message}`);
  }
};

const createSubmission = async (submissionData: any): Promise<any> => {
  let submission = new Submission(submissionData);
  submission = await submission.save();
  return submission;
};

const submissionRepository = {
  findUsernameProblemIdSubmissions,
  findAcceptedProblemIdSubmissions,
  createSubmission
};

export default submissionRepository;
