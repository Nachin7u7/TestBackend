export const veredictTestCaseHelper = (index: number, userOutput: any, expectedOutput: string, limits: any) => {
  const { timeLimit, memoryLimit } = limits;

  // TimeOut JDoodle
  if (userOutput.body.output.includes('JDoodle - output Limit reached.')) {
    return {
      name: 'tle',
      label: 'Time Limit Exceeded on Test Case ' + String(index + 1)
    };
  }

  // Compilation Error
  if (
    userOutput.body.memory == null ||
    userOutput.body.output.includes('File "/home/')
  ) {
    return {
      name: 'ce',
      label: 'Compilation Error'
    };
  }

  // Memory Limit
  if (userOutput.body.memory > memoryLimit) {
    return {
      name: 'mle',
      label: 'Memory Limit Exceeded on Test Case ' + String(index + 1)
    };
  }

  // Time Limit
  if (userOutput.body.cpuTime > timeLimit) {
    return {
      name: 'tle',
      label: 'Time Limit Exceeded on Test Case ' + String(index + 1)
    };
  }

  // Wrong Answer
  if (userOutput.body.output.trim() !== expectedOutput.trim()) {
    return {
      name: 'wa',
      label: 'Wrong Answer on Test Case ' + String(index + 1)
    };
  }

  return null;
};
