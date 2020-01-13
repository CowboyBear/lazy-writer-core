var parseArgs = require('minimist');
var fs = require('fs');
var yaml = require('js-yaml');

module.exports.main = function (args) {
  const options = parseArgs(args.slice(2));
  
  const yamlFileContent = fs.readFileSync(process.cwd() + '/' + options['f'], 'utf8');
  
  const configuration = yaml.safeLoad(yamlFileContent);      
}