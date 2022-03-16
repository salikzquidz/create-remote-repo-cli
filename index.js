#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const files = require("./lib/files.js");
const github = require("./lib/github.js");
const repo = require("./lib/repo.js");

clear();

if (files.directoryExists(".git")) {
  console.log(chalk.red("Already a Git repository"));
  process.exit(0);
}

console.log(
  chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" }))
);

const run = async () => {
  try {
    let token = await github.getPersonalAccessToken();

    github.githubAuth(token);

    const url = await repo.createRemoteRepo();

    await repo.createGitignore();

    await repo.setupRepo(url);
  } catch (error) {
    if (error) {
      switch (error.status) {
        case 401:
          console.log(
            chalk.red(`Couldn't log you in. Please provide correct credentials`)
          );
          break;
        case 422:
          console.log(
            chalk.red(
              `There is already a remote repository or token with the same name`
            )
          );
          break;
        default:
          console.log(chalk.red(error));
      }
    }
  }
};

run();
