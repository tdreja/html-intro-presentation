/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[t]sx?$",
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'build/test-results/typescript', 
      outputName: 'report.xml', 
      includeConsoleOutput: true, 
      reportTestSuiteErrors: true, 
      classNameTemplate: '{title}',
      titleTemplate: '{title}',
      suiteNameTemplate: '{filename}'
    }]
  ]
};