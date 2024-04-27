import { ISubmissionEntity } from "../../entities/ISubmissionEntity";
import { Submission } from "../../models";
import { buildLogger } from '../../plugin';
import { SubmissionRepository } from "../submissionRepository";

export class SubmissionRepositoryImpl implements SubmissionRepository {

    logger = buildLogger('submissionRepository');
    async findUsernameProblemIdSubmissions(username: string, problemId: number): Promise<ISubmissionEntity[]> {
        this.logger.log('Attempting to fetch submissions for the given username and problem id.', { username, problemId });
        try {
            const submissionsList = await Submission.find({
                username,
                problemId,
            });
            this.logger.log('Successfully fetched submissions for the given username and problem id.');
            return submissionsList;
        } catch (error: any) {
            this.logger.error('Error while fetching submissions for the given username and problem id.', {
                error: error.message,
                username,
                problemId
            });
            throw new Error(`Failed to fetch submissions for the given username and problem id: ${error.message}`);
        }
    };

    async findAcceptedProblemIdSubmissions(problemId: number): Promise<ISubmissionEntity[]> {
        this.logger.log('Attempting to fetch accepted submissions for the given problem id.', { problemId });
        try {
            const submissions = await Submission.find({
                problemId,
                verdict: "Accepted!",
            });
            this.logger.log('Successfully fetched accepted submissions for the given problem id.');
            return submissions;
        } catch (error: any) {
            this.logger.error('Error while fetching accepted submissions for the given problem id.', {
                error: error.message,
                problemId
            });
            throw new Error(`Failed to fetch accepted submissions for the given problem id: ${error.message}`);
        }
    };

    async createSubmission(submissionData: ISubmissionEntity) {
        let submission = new Submission(submissionData);
        submission = await submission.save();
        return submission;
    };
}

