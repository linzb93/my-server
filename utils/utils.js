const chalk = require('chalk');

exports.errorLogger = text => {
  console.log(chalk.red(text));
}