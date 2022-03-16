const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryName: () => {
    return path.basename(process.cwd());
  },
  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },
};
