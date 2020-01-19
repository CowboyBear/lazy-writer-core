const codeGenerationComponent = require('../components/codeGenerationComponent');

function NgGenerateCallBackHandler(configuration, CLIOptions){
  this.configuration = configuration;
  this.CLIOptions = CLIOptions;
}

NgGenerateCallBackHandler.prototype.handle = function handle(error, stdout, stderr){  
  if (error) {
    console.log('Error while creating entity: ', stderr);
    return;
  } 
  
  console.log('Angular component created!');  
  
  console.log(this.configuration);

  codeGenerationComponent.generateHTML(this.configuration);
}

module.exports = NgGenerateCallBackHandler;