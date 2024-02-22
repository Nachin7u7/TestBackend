const VERDICTS = {
  ACCEPTED: { name: 'ac', label: 'Accepted!' },
  TIME_LIMIT_EXCEEDED: {
    name: 'tle',
    label: 'Time Limit Exceeded on Test Case ',
  },
  COMPILATION_ERROR: { name: 'ce', label: 'Compilation Error' },
  MEMORY_LIMIT_EXCEEDED: {
    name: 'mle',
    label: 'Memory Limit Exceeded on Test Case ',
  },
  WRONG_ANSWER: { name: 'wa', label: 'Wrong Answer on Test Case ' },
};

module.exports = VERDICTS;
