const touch = require("touch");
const CLI = require("clui");
const fs = require("fs");
const git = require("simple-git/promise")();
const Spinner = CLI.Spinner;
const _ = require("lodash");
const inquirer = require("./inquirer");
const gh = require("./github");

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const { name, description, visibility } = answers;

    const data = {
      name,
      description,
      private: visibility === "private",
    };

    const status = new Spinner("Creating remote repository");
    status.start();

    try {
      const response = await github.rest.repos.createForAuthenticatedUser(data);

      return response.data.clone_url; // https url
    } finally {
      status.stop();
    }
  },
  createGitignore: async () => {
    // check if this directory already git initialized
    const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);

      const { ignore } = answers;

      if (ignore.length) {
        // append if user want to ignore a file
        fs.writeFileSync(".gitignore", ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    }

    try {
    } catch (error) {}
  },

  setupRepo: async (url) => {
    const status = new Spinner(
      "Initializing local repo and pushing to remote.."
    );
    status.start();
    try {
      git
        .init()
        .then(git.add(".gitignore"))
        .then(git.add("./*"))
        .then(git.commit("Initial commit"))
        .then(git.addRemote("origin", url))
        .then(git.push("origin", "master"));
    } catch (error) {
      return error;
    } finally {
      status.stop();
    }
  },
};
