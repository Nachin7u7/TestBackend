import { ISubmissionEntity } from "../entities/ISubmissionEntity";

export interface SubmissionRepository {
  findUsernameProblemIdSubmissions(username: string, problemId: number): Promise<ISubmissionEntity[]>;
  findAcceptedProblemIdSubmissions(problemId: number): Promise<ISubmissionEntity[]>;
  createSubmission(submissionData: ISubmissionEntity): Promise<ISubmissionEntity>;
}