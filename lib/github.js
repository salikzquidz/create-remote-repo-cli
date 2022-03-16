const CLI = require("clui");
const Configstore = require("configstore");
const Spinner = CLI.Spinner;
const { createTokenAuth } = require("@octokit/auth-token");
const chalk = require("chalk");

const inquirer = require("./inquirer");
const pkg = require("../package.json");

const { Octokit } = require("octokit");

const conf = new Configstore(pkg.name);
let octokit;

module.exports = {
  getInstance: () => {
    return octokit;
  },

  githubAuth: async (token) => {
    octokit = new Octokit({
      auth: token,
    });

    let username;
    await octokit.rest.users
      .getAuthenticated()
      .then((result) => {
        username = result.data.login;
        conf.set("github.token", token);
      })
      .catch((error) => {
        console.log(error);
        switch (error.status) {
          case 401:
            console.log(
              chalk.red(
                `Couldn't log you in. Please provide correct credentials betul betul lah`
              )
            );
            break;
          default:
            console.log(chalk.red(error));
        }
      });

    if (username) {
      console.log(chalk.green("Hello, ", username));
    }
  },

  // getStoredPersonalAccessToken: () => {
  //   let token = conf.get("github.token");
  //   return token;
  // },

  getPersonalAccessToken: async () => {
    const accessToken = await inquirer.askGithubPersonalAccessToken();
    const status = new Spinner(`Accepting input`);
    status.start();

    const { personalAccessToken } = accessToken;

    const auth = createTokenAuth(personalAccessToken);
    const { token, tokenType } = await auth();

    try {
      if (token) {
        return token;
      }
    } finally {
      status.stop();
    }
  },
};
