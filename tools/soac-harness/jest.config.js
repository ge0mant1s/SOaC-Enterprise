module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // dist/ holds tsc output (incl. compiled tests); run the TS sources only.
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
