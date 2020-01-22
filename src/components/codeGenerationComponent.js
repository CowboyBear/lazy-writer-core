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
    var textFieldHTML = template.toString().replace(/FIELD_DISPLAY_NAME/g, field.name);
    textFieldHTML = textFieldHTML.replace(/FIELD_NAME/g, field.name);
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


module.exports.generateModel = (configuration) => {
  const modelFolderPath = process.cwd() + '/src/app/model';
  const entityName = formatEntityName(configuration['entity']);
  const fileName = entityName + ".ts";
  const modelFilePath  = modelFolderPath + '/' + fileName;
  const modelPropertyTemplate = getTemplateContent('ts', 'model-property.ts').toString();
  
  if(!fs.existsSync(modelFolderPath)) {
    fs.mkdirSync(modelFolderPath);
  }

  fs.writeFileSync(modelFilePath, '');

  var tsFileContent = 'export class ' + entityName + ' {\n\n';  

  configuration['fields'].forEach((field) => {
    var propertyContent = modelPropertyTemplate.replace(/FIELD_NAME/g, field.name);
    propertyContent = propertyContent.replace(/FIELD_TYPE/g, field.type);

    tsFileContent += propertyContent;
  }); 

  tsFileContent += '}'

  fs.writeFileSync(modelFilePath, tsFileContent);  
};

function formatEntityName(entityName) {
  return entityName
    .toLowerCase()
    .replace(/(\b[a-z](?!\s))/, (x) => { return x.toUpperCase(); });
}

