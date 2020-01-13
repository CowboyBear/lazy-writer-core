var parseArgs = require('minimist');
var fs = require('fs');
var yaml = require('js-yaml');
var chalk = require('chalk');

module.exports.main = function (args) {
  const options = parseArgs(args.slice(2));
  
  if (options['f'] && typeof options['f'] === 'string') {
    const yamlFileContent = fs.readFileSync(process.cwd() + '/' + options['f'], 'utf8');
    const configuration = yaml.safeLoad(yamlFileContent);     
    console.log(configuration) ;
  } else {
    console.log(chalk.red('Template file is missing, please use the -f argument.'));
  }
}