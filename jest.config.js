module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "test",
  testRegex: ".*\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
