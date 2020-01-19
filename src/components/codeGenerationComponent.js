const fs = require('fs');
const dirnameWrapper = require('../wrapper/dirnameWrappper');

module.exports.generateHTML = (configuration) => {
  var entityName = configuration['entity'].toLowerCase();
  const componentHTMLFilePath = process.cwd() + '/src/app/' + entityName + '/' + entityName + '.component.html';    

  textFields = configuration['fields'].filter((field) => { return field.type.toLowerCase() === 'string' });
  
  cleanFile(componentHTMLFilePath);  
  initForm(componentHTMLFilePath);
  createTextFields(textFields, componentHTMLFilePath);  
  closeForm(componentHTMLFilePath);
};

function cleanFile(filePath) {
  fs.writeFileSync(filePath, '');
}

function initForm(filePath){  
  fs.appendFileSync(filePath, getTemplateContent('html', 'form-start.html'));    
}

function createTextFields(fields, filePath) {    
  fields.forEach((field) => {
    fs.appendFileSync(filePath, getTemplateContent('html', 'text-input.html'));
  });
}

function closeForm(filePath) {
  fs.appendFileSync(filePath, getTemplateContent('html', 'form-end.html'));
}

function getTemplateContent(type, fileName) {
  const templateFilePath = dirnameWrapper + '/../assets/templates/' + type + '/' + fileName;
  return fs.readFileSync(templateFilePath);
}

