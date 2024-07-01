import { JdoodleService } from './jdoodleService';
import { buildLogger } from '../plugin';
import { LANGUAGE_CONFIG, VERDICTS } from '../constants';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import { SubmissionRepositoryImpl } from '../repositories/implements/submissionRepositoryImpl';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';
import { veredictTestCaseHelper } from '../helper/veredictTestCaseHelper';
import { PostSubmissionDto } from '../dtos/postSubmissionDto';

export class SubmissionService {

  private jdoodleService: JdoodleService;
  
  constructor(
    private submissionRepository: SubmissionRepositoryImpl,
    private problemRepository: ProblemRepositoryImpl,
    private userRepository: UserRepositoryImpl
  ) {  
    this.jdoodleService = new JdoodleService();
  };

  logger = buildLogger('submissionService');
  

  async getUsernameProblemIdSubmissions(
    username: any,
    problemId: any
  ): Promise<any> {
    this.logger.log(
      'Attempting to fetch submissions for given username and problem id.',
      { username, problemId }
    );
    try {
      const submissionsList = await this.submissionRepository.findUsernameProblemIdSubmissions(
        username,
        problemId
      );
      this.logger.log(
        'Successfully fetched submissions for given username and problem id.'
      );
      return submissionsList;
    } catch (err: any) {
      this.logger.error(
        'Error while fetching submissions for given username and problem id.',
        { error: err.message, username, problemId }
      );
      throw new Error(
        'Failed to fetch submissions for the given username and problem id.'
      );
    }
  };

  async getAcceptedProblemIdSubmissions(
    problemId: number
  ): Promise<any> {
    this.logger.log('Attempting to fetch accepted submissions for given problem id.', {
      problemId,
    });
    try {
      const submissions: any = await this.submissionRepository.findAcceptedProblemIdSubmissions(problemId);
      submissions.sort((s1: any, s2: any) => s1.time - s2.time);
      this.logger.log(
        'Successfully fetched accepted submissions for given problem id.'
      );
      return submissions;
    } catch (err: any) {
      this.logger.error(
        'Error while fetching accepted submissions for given problem id.',
        { error: err.message, problemId }
      );
      throw new Error(
        'Failed to fetch accepted submissions for the given problem id.'
      );
    }
  };

  getLanguageConfig(lang: string) {
    return LANGUAGE_CONFIG[lang] || { language: lang, versionIndex: '0' };
  };

  

  async executeTestCases(
    problem: any,
    isSample: any,
    code: any,
    lang: any,
    versionIndex: any
  ): Promise<any> {
    let verdict = null;

    // For each test case
    const problemJSON = JSON.parse(JSON.stringify(problem));

    const timeLimit = problemJSON.published.config.timelimit / 1000;
    const memoryLimit = problemJSON.published.config.memorylimit * 1000;

    let maxTime = 0,
      maxMemory = 0;

    for (let i = 0; i < problemJSON.published.testcases.length; i++) {
      // If user has clicked on "Run" button then we will only run the code on sample testcases.
      if (isSample && problemJSON.published.testcases[i].isSample == false)
        continue;

      const userProgram = {
        script: code,
        stdin: problemJSON.published.testcases[i].input.url,
        language: lang,
        versionIndex: versionIndex,
      };

      const clientCodeResult = await this.jdoodleService.compileAndRun(userProgram);

      maxTime = Math.max(maxTime, clientCodeResult.body.cpuTime || 0);
      maxMemory = Math.max(maxMemory, clientCodeResult.body.memory || 0);

      const expectedOutput = problemJSON.published.testcases[i].output.url; 

      //const isCorrect = clientCodeResult.body.output === expectedOutput;

      
      //help demostrate the equality
      this.logger.log('Client code result:', clientCodeResult.body.output);
      this.logger.log('expected Result:', expectedOutput);
      console.log(expectedOutput, problemJSON.published.testcases[i].output.url)


      verdict = veredictTestCaseHelper(i, clientCodeResult, expectedOutput, {memoryLimit, timeLimit})
      if(verdict !== null)
        break
    }

    if (!verdict) {
      verdict = { name: 'ac', label: 'Accepted!' };
    }
    
    return { verdict, maxTime, maxMemory };
  };

  async postSubmission(userInfo: any , postSubmissionDto: PostSubmissionDto): Promise<any> {
    try {
      const { language: lang, versionIndex } = this.getLanguageConfig(postSubmissionDto.language);

      let problem = await this.problemRepository.findPublishedProblemById(postSubmissionDto.problemId);

      if (!problem) {
        throw new Error('Problem not found or not published.');
      }

      const { verdict, maxTime, maxMemory } = await this.executeTestCases(
        problem,
        postSubmissionDto.isSample,
        postSubmissionDto.code,
        lang,
        versionIndex
      );

      if (!postSubmissionDto.isSample) {
        await this.submissionRepository.createSubmission({
          username: userInfo.username,
          problemId: postSubmissionDto.problemId,
          code: postSubmissionDto.code,
          language: postSubmissionDto.language,
          verdict: verdict.label,
          time: maxTime,
          memory: maxMemory,
        });

        if (verdict.name === 'ac') {
          problem.solvedCount += 1;
        }
        problem.totalSubmissions += 1;
        await problem.save();

        const user: any = await this.userRepository.findUserById(userInfo.id);
        if (verdict.name === 'ac') {
          if (user.stats.solved.indexOf(postSubmissionDto.problemId) === -1) {
            user.stats.solved.push(postSubmissionDto.problemId);
            user.stats.solvedCount += 1;

            const index = user.stats.unsolved.indexOf(postSubmissionDto.problemId);
            if (index !== -1) {
              user.stats.unsolved.splice(index, 1);
            }
          }
        } else {
          if (
            user.stats.solved.indexOf(postSubmissionDto.problemId) === -1 &&
            user.stats.unsolved.indexOf(postSubmissionDto.problemId) === -1
          ) {
            user.stats.unsolved.push(postSubmissionDto.problemId);
          }
        }
        await user.save();
      }
      return {
        name: verdict.name,
        label: verdict.label,
      };
    } catch (err) {
      throw err;
    }
  };

}
