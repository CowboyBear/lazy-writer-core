var parseArgs = require('minimist');
var fs = require('fs');
var yaml = require('js-yaml');
var chalk = require('chalk');
const { exec } = require('child_process');
const NgGenerateCallBackHandler = require('./handler/ngGenerateCallbackHandler');

module.exports.main = function (args) {
  const options = parseArgs(args.slice(2));
  
  if (options['f'] && typeof options['f'] === 'string') {
    const yamlFileContent = fs.readFileSync(process.cwd() + '/' + options['f'], 'utf8');
    const configuration = yaml.safeLoad(yamlFileContent);  
    var callbackHandler =  new NgGenerateCallBackHandler(configuration, options); 

    exec('ng generate component ' + configuration.entity, (err, stdout, stderr) => {
      callbackHandler.handle(err, stdout,stderr);
    });
  } else {
    console.log(chalk.red('Template file is missing, please use the -f argument.'));
  }
}