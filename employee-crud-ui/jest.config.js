// module.exports = {
//   transformIgnorePatterns: [
//     "/node_modules/(?!axios)/", // transform axios
//   ],
//   transform: {
//     "^.+\\.[jt]sx?$": "babel-jest",
//   },
//   testEnvironment: "jsdom",
// };

module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/",
  ],
//   moduleFileExtensions: ["js", "jsx"],
};