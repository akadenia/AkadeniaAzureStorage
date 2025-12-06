/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": ["ts-jest"],
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "__tests__/test-utils.ts"],
}
