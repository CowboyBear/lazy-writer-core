const fs = require('fs');
const dirnameWrapper = require('../wrapper/dirnameWrappper');

module.exports.generateHTML = (configuration) => {
  var entityName = configuration['entity'].toLowerCase();

  const formStartTemplateFilePath = dirnameWrapper + '/../assets/templates/html/form-start.html';
  const componentHTMLFilePath = process.cwd() + '/src/app/' + entityName + '/' + entityName + '.component.html';  
  
  var formStartContent = fs.readFileSync(formStartTemplateFilePath);

  fs.writeFileSync(componentHTMLFilePath, '');
  fs.appendFileSync(componentHTMLFilePath, formStartContent);    
};