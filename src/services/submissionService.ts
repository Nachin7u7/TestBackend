import { compileAndRun } from './jdoodleService';
import { buildLogger } from '../plugin';
import { LANGUAGE_CONFIG, VERDICTS } from '../constants';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import { SubmissionRepositoryImpl } from '../repositories/implements/submissionRepositoryImpl';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';
import { veredictTestCaseHelper } from '../helper/veredictTestCaseHelper';

export class SubmissionService {

  constructor(
    private submissionRepository: SubmissionRepositoryImpl,
    private problemRepository: ProblemRepositoryImpl,
    private userRepository: UserRepositoryImpl
  ) { };

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
    const checkerCode = problemJSON.published.checkerCode;

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

      const clientCodeResult = await compileAndRun(userProgram);
      console.log('🚀 ~ router.post ~ clientCodeResult:', clientCodeResult.body);

      maxTime = Math.max(maxTime, clientCodeResult.body.cpuTime || 0);
      maxMemory = Math.max(maxMemory, clientCodeResult.body.memory || 0);

      const checkerProgram = {
        script: checkerCode,
        stdin: problemJSON.published.testcases[i].input.url,
        language: 'cpp17',
        versionIndex: '1'
      }

      console.log('🚀 ~ router.post ~ program:', checkerProgram);
      const checkerCodeResult = await compileAndRun(checkerProgram);
      console.log('🚀 ~ router.post ~ checkerCodeResult:', checkerCodeResult);

      verdict = veredictTestCaseHelper(i, clientCodeResult, checkerCodeResult, {memoryLimit, timeLimit})
      if(verdict !== null)
        break
    }

    // AC
    if(!verdict){
      verdict = { name: 'ac', label: 'Accepted!' }
    }
    
    return { verdict, maxTime, maxMemory };
  };

  async postSubmission(req: any): Promise<any> {
    try {
      const { problemId, isSample, code, language } = req.body;
      const { language: lang, versionIndex } = this.getLanguageConfig(language);

      let problem = await this.problemRepository.findPublishedProblemById(problemId);

      if (!problem) {
        throw new Error('Problem not found or not published.');
      }

      const { verdict, maxTime, maxMemory } = await this.executeTestCases(
        problem,
        isSample,
        code,
        lang,
        versionIndex
      );

      if (!isSample) {
        await this.submissionRepository.createSubmission({
          username: req.user.username,
          problemId: problemId,
          code: code,
          language: language,
          verdict: verdict.label,
          time: maxTime,
          memory: maxMemory,
        });

        if (verdict.name == 'ac') {
          problem.solvedCount += 1;
        }
        problem.totalSubmissions += 1;
        await problem.save();

        const user: any = await this.userRepository.findUserById(req.user.id);
        if (verdict.name === 'ac') {
          if (user.stats.solved.indexOf(problemId) == -1) {
            user.stats.solved.push(problemId);
            user.stats.solvedCount += 1;

            let index = user.stats.unsolved.indexOf(problemId);
            if (index !== -1) {
              user.stats.unsolved.splice(index, 1);
            }
          }
        } else {
          if (
            user.stats.solved.indexOf(problemId) == -1 &&
            user.stats.unsolved.indexOf(problemId) == -1
          ) {
            user.stats.unsolved.push(problemId);
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
