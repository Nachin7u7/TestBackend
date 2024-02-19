const submissionRepository = require('../repositories/submissionRepository');
const User = require('../repositories/userRepository');
const problemRepository = require('../repositories/problemRepository');
const { config } = require('../config');
const compileAndRun = require('./jdoodleService');
const { buildLogger } = require('../plugin');
const { LANGUAGE_CONFIG, VERDICTS } = require('../constants');

const { jdoodle } = config;
const logger = buildLogger('submissionService');

const getUsernameProblemIdSubmissions = async (req) => {
  try {
    const submissionsList =
      await submissionRepository.getUsernameProblemIdSubmissions(
        req.query.username,
        req.query.problemId
      );
    return submissionsList;
  } catch (err) {
    throw err;
  }
};

const getAcceptedProblemIdSubmissions = async (req) => {
  try {
    const submissions =
      await submissionRepository.getAcceptedProblemIdSubmissions(
        req.query.problemId
      );
    submissions.sort((s1, s2) => s1.time - s2.time);
    return submissions;
  } catch (err) {
    throw err;
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
    
    let maxTime = 0, maxMemory = 0;
    for (let i = 0; i < problemJSON.published.testcases.length; i++) {
      // If user has clicked on "Run" button then we will only run the code on sample testcases.
      if (
        isSample &&
        problemJSON.published.testcases[i].isSample == false
      )
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
