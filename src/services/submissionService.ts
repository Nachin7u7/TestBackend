import { compileAndRun } from './jdoodleService';
import { buildLogger } from '../plugin';
import { LANGUAGE_CONFIG, VERDICTS } from '../constants';
import { UserRepositoryImpl } from '../repositories/implements/userRepositoryImpl';
import { SubmissionRepositoryImpl } from '../repositories/implements/submissionRepositoryImpl';
import { ProblemRepositoryImpl } from '../repositories/implements/problemRepositoryImpl';


const logger = buildLogger('submissionService');

const userRepository = new UserRepositoryImpl();
const submissionRepository = new SubmissionRepositoryImpl();
const problemRepository = new ProblemRepositoryImpl();

const getUsernameProblemIdSubmissions = async (
  username: any,
  problemId: any
): Promise<any> => {
  logger.log(
    'Attempting to fetch submissions for given username and problem id.',
    { username, problemId }
  );
  try {
    const submissionsList = await submissionRepository.findUsernameProblemIdSubmissions(
      username,
      problemId
    );
    logger.log(
      'Successfully fetched submissions for given username and problem id.'
    );
    return submissionsList;
  } catch (err: any) {
    logger.error(
      'Error while fetching submissions for given username and problem id.',
      { error: err.message, username, problemId }
    );
    throw new Error(
      'Failed to fetch submissions for the given username and problem id.'
    );
  }
};
const getAcceptedProblemIdSubmissions = async (
  problemId: number
): Promise<any> => {
  logger.log('Attempting to fetch accepted submissions for given problem id.', {
    problemId,
  });
  try {
    const submissions: any = await submissionRepository.findAcceptedProblemIdSubmissions(problemId);
    submissions.sort((s1: any, s2: any) => s1.time - s2.time);
    logger.log(
      'Successfully fetched accepted submissions for given problem id.'
    );
    return submissions;
  } catch (err: any) {
    logger.error(
      'Error while fetching accepted submissions for given problem id.',
      { error: err.message, problemId }
    );
    throw new Error(
      'Failed to fetch accepted submissions for the given problem id.'
    );
  }
};

const getLanguageConfig = (lang: string) => {
  return LANGUAGE_CONFIG[lang] || { language: lang, versionIndex: '0' };
};

const executeTestCases = async (
  problem: any,
  isSample: any,
  code: any,
  lang: any,
  versionIndex: any
): Promise<any> => {
  let verdict = VERDICTS.ACCEPTED;

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

    let program = {
      script: code,
      stdin: problemJSON.published.testcases[i].input.url,
      language: lang,
      versionIndex: versionIndex,
    };

    const clientCodeResult = await compileAndRun(program);
    console.log('🚀 ~ router.post ~ clientCodeResult:', clientCodeResult.body);

    maxTime = Math.max(maxTime, clientCodeResult.body.cpuTime || 0);
    maxMemory = Math.max(maxMemory, clientCodeResult.body.memory || 0);
    // TimeOut JDoodle
    if (clientCodeResult.body.output.includes('JDoodle - Timeout')) {
      verdict.name = 'tle';
      verdict.label = 'Time Limit Exceeded on Test Case ' + String(i + 1);
      break;
    }
    // Compilation Error
    if (
      clientCodeResult.body.memory == null ||
      clientCodeResult.body.output.includes('File "/home/')
    ) {
      verdict.name = 'ce';
      verdict.label = 'Compilation Error';
      break;
    }

    // Memory Limit
    if (clientCodeResult.body.memory > memoryLimit) {
      verdict.name = 'mle';
      verdict.label = 'Memory Limit Exceeded on Test Case ' + String(i + 1);
      break;
    }
    // TLE
    if (clientCodeResult.body.cpuTime > timeLimit) {
      verdict.name = 'tle';
      verdict.label = 'Time Limit Exceeded on Test Case ' + String(i + 1);
      break;
    }

    program.language = 'cpp17';
    program.versionIndex = '1';
    program.script = checkerCode;
    program.stdin =
      problemJSON.published.testcases[i].input.url +
      ' ' +
      clientCodeResult.body.output;
    console.log('🚀 ~ router.post ~ program:', program);
    const checkerCodeResult = await compileAndRun(program);
    console.log('🚀 ~ router.post ~ checkerCodeResult:', checkerCodeResult);

    if (checkerCodeResult.body.output[0] != '1') {
      verdict.name = 'wa';
      verdict.label = 'Wrong Answer on Test Case ' + String(i + 1);
      break;
    }
  }
  return { verdict, maxTime, maxMemory };
};

const postSubmission = async (req: any): Promise<any> => {
  try {
    const { problemId, isSample, code, language } = req.body;
    const { language: lang, versionIndex } = getLanguageConfig(language);

    let problem = await problemRepository.findPublishedProblemById(problemId);

    if (!problem) {
      throw new Error('Problem not found or not published.');
    }

    const { verdict, maxTime, maxMemory } = await executeTestCases(
      problem,
      isSample,
      code,
      lang,
      versionIndex
    );

    if (!isSample) {
      await submissionRepository.createSubmission({
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

      const user:any = await userRepository.findUserById(req.user.id);
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

export {
  getUsernameProblemIdSubmissions,
  getAcceptedProblemIdSubmissions,
  postSubmission,
};;
