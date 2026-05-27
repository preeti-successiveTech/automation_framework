module.exports = {
  default: {
    requireModule: ["ts-node/register"],         // understand typesScript files without this .ts file does not run

    require: [
      "src/steps/**/*.ts",                 //loads steps files  // it scan all the files
      "src/hooks/**/*.ts"                  // loads hooks files
    ],

    paths: [
      "src/features/**/*.feature"            // Cucumber scans for:  Gherkin feature files.

    ],

    format: [
      "progress",
      "allure-cucumberjs/reporter"
    ],

    formatOptions: {
      resultsDir: "allure-results"
    },

    publishQuiet: true
  }
};