var parseArgs = require('minimist')

module.exports.main = function (args) {
  const options = parseArgs(args.slice(2));
  console.log(args);
  console.log(options);
}