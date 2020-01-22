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
  var template = getTemplateContent('html', 'text-input.html')
  
  fields.forEach((field) => {
    var textFieldHTML = template.toString().replace(/FIELD_DISPLAY_NAME/, field.name);
    textFieldHTML = textFieldHTML.replace(/FIELD_NAME/, field.name);
    fs.appendFileSync(filePath, textFieldHTML);
  });
}

function closeForm(filePath) {
  fs.appendFileSync(filePath, getTemplateContent('html', 'form-end.html'));
}

function getTemplateContent(type, fileName) {
  const templateFilePath = dirnameWrapper + '/../assets/templates/' + type + '/' + fileName;
  return fs.readFileSync(templateFilePath);
}

