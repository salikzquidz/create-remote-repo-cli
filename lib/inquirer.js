const inquirer = require("inquirer");
const files = require("./files");

module.exports = {
  askGithubPersonalAccessToken: () => {
    const questions = [
      {
        name: "personalAccessToken",
        type: "input",
        message: "Enter your personal access token: ",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your personal access token";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },

  askRepoDetails: () => {
    const argv = require("minimist")(process.argv.slice(2));
    console.log(argv);
    const questions = [
      {
        name: "name",
        input: "input",
        message: "Enter a name for the repository: ",
        default: argv._[0] || files.getCurrentDirectoryName(),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a name for this repository";
          }
        },
      },
      {
        name: "description",
        type: "input",
        default: argv._[1] || null,
        message: "Optionally enter a description for this repository",
      },
      {
        name: "visibility",
        type: "list",
        message: "Public or private",
        choices: ["public", "private"],
        default: "public",
      },
    ];
    return inquirer.prompt(questions);
  },

  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        name: "ignore",
        type: "checkbox",
        message: " Select the files and/or folders you wish to ignore",
        choices: filelist,
        default: ["node_modules", "bower_components"],
      },
    ];
    return inquirer.prompt(questions);
  },
};
