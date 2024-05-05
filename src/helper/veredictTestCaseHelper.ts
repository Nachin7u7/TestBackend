

export const veredictTestCaseHelper = (index: number, userOutput: any, checkerOutput: any, limits: any) =>{

    const {timeLimit, memoryLimit} = limits

    // TimeOut JDoodle
    if (userOutput.body.output.includes('JDoodle - output Limit reached.')) {
      return {
        name: 'tle',
        label: 'Time Limit Exceeded on Test Case ' + String(index + 1)
      }
    }

    // Compilation Error
    if (
      userOutput.body.memory == null ||
      userOutput.body.output.includes('File "/home/')
    ) {
      return {
        name: 'ce',
        label: 'Compilation Error'
      }
    }

    // Memory Limit
    if (userOutput.body.memory > memoryLimit) {
      return {
        name: 'mle',
        label: 'Memory Limit Exceeded on Test Case ' + String(index + 1)
      }
    }

    // TLE
    if (userOutput.body.cpuTime > timeLimit) {
      return {
        name: 'tle',
        label: 'Time Limit Exceeded on Test Case ' + String(index + 1)
      }
    }

    // WA
    if (userOutput.body.output !== checkerOutput.body.output) {
      return {
        name: 'wa',
        label: 'Wrong Answer on Test Case ' + String(index + 1)
      }
    }
    return null
  }