const submissionRepository = require('../repositories/submissionRepository');
const User = require('../repositories/userRepository');
const problemRepository = require('../repositories/problemRepository');
const { config } = require('../config');
const compileAndRun = require('./jdoodleService');
const { buildLogger } = require('../plugin');
const { jdoodle } = config;
const logger = buildLogger('submissionService');

const getUsernameProblemIdSubmissions = async (username, problemId) => {
  logger.log('Attempting to fetch submissions for given username and problem id.', {
    username: username,
    problemId: problemId
  });
  try {
    const submissionsList =
      await submissionRepository.getUsernameProblemIdSubmissions(
        username,
        problemId
      );
    logger.log(
      'Successfully fetched submissions for given username and problem id.');
    return submissionsList;
  } catch (err) {
    logger.error(
      'Error while fetching submissions for given username and problem id.',
      {
        error: err.message,
        username: username,
        problemId: problemId,
      }
    );
    throw new Error(
      'Failed to fetch submissions for the given username and problem id.'
    );
  }
};

const getAcceptedProblemIdSubmissions = async (problemId) => {
  logger.log('Attempting to fetch accepted submissions for given problem id.', {
    problemId: problemId
  });
  try {
    const submissions =
      await submissionRepository.getAcceptedProblemIdSubmissions(problemId);
    submissions.sort((s1, s2) => s1.time - s2.time);
    logger.log('Successfully fetched accepted submissions for given problem id.');
    return submissions;
  } catch (err) {
    logger.error(
      'Error while fetching accepted submissions for given problem id.',
      {
        error: err.message,
        problemId: problemId,
      }
    );
    throw new Error(
      'Failed to fetch accepted submissions for the given problem id.'
    );
  }
};

const getLanguageConfig = (lang) =>
  LANGUAGE_CONFIG[lang] || { language: lang, versionIndex: '0' };

const postSubmission = async (req) => {
  try {
    const { problemId, isSample, code, language } = req.body;
    const { language: lang, versionIndex } = getLanguageConfig(language);

    // TODO: verificar para que sirve el  published
    let problem = await problemRepository.findOne(
      {
        problemId,
        isPublished: true,
      },
      {
        'published.testcases': 1,
        'published.config': 1,
        'published.checkerCode': 1,
        solvedCount: 1,
        totalSubmissions: 1,
      }
    );

    if (!problem) {
      throw new Error('Problem not found or not published.');
    }

    let verdict = VERDICTS.ACCEPTED;
    // For each test case
    problemJSON = JSON.parse(JSON.stringify(problem));
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
        language: language,
        versionIndex: versionIndex,
        clientId: jdoodle.clientId,
        clientSecret: jdoodle.clientSecret,
      };
      const clientCodeResult = await compileAndRun(program);
      maxTime = Math.max(maxTime, clientCodeResult.body.cpuTime || 0);
      maxMemory = Math.max(maxMemory, clientCodeResult.body.memory || 0);
      if (clientCodeResult.body.output.includes('JDoodle - Timeout')) {
        verdictName = 'tle';
        verdictLabel = 'Time Limit Exceeded on Test Case ' + String(i + 1);
        break;
      }
      if (
        clientCodeResult.body.memory == null ||
        clientCodeResult.body.output.includes('File "/home/')
      ) {
        verdictName = 'ce';
        verdictLabel = 'Compilation Error';
        break;
      }
      if (clientCodeResult.body.memory > memoryLimit) {
        verdictName = 'mle';
        verdictLabel = 'Memory Limit Exceeded on Test Case ' + String(i + 1);
        break;
      }
      if (clientCodeResult.body.cpuTime > timeLimit) {
        verdictName = 'tle';
        verdictLabel = 'Time Limit Exceeded on Test Case ' + String(i + 1);
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
      const checkerCodeResult = await complieAndRunHelper(program);
      console.log('🚀 ~ router.post ~ checkerCodeResult:', checkerCodeResult);

      if (checkerCodeResult.body.output[0] != '1') {
        verdictName = 'wa';
        verdictLabel = 'Wrong Answer on Test Case ' + String(i + 1);
        break;
      }
    }
    if (!isSample) {
      let submission = new Submission({
        username: req.session.passport.user.username,
        problemId: problemId,
        code: code,
        language: req.body.language,
        verdict: verdictLabel,
        time: maxTime,
        memory: maxMemory,
      });
      submission = await submission.save();

      if (verdictName == 'ac') {
        problem.solvedCount += 1;
      }
      problem.totalSubmissions += 1;
      await problem.save();

      const user = await User.findById(req.session.passport.user._id);
      if (verdictName === 'ac') {
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
      name: verdictName,
      label: verdictLabel,
    };
  } catch (err) {
    throw err;
  }
};

const submissionService = {
  getUsernameProblemIdSubmissions,
  getAcceptedProblemIdSubmissions,
  postSubmission,
};

module.exports = submissionService;
