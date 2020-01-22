const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;
const proxyquire = require('proxyquire');

const fsSpy = {};
const dirnameWrapperMock = '/mock/relative/path';

var mockComponentHTMLFilePath;
var mockConfiguration;
var component;

describe('codeGenerationComponent', () => {
  describe('generateHTML()', () => {
    before(() => {         
      chai.use(spies); 
      process.cwd =  chai.spy.returns('/mock/base/path');          
      mockComponentHTMLFilePath = process.cwd() + '/src/app/person/person.component.html';

      mockConfiguration = {
        entity: "Person",
        fields: [
          { name: 'name', type: 'string' },
          { name: 'email', type: 'string' },
          { name: 'notString', type: 'int'}
        ]      
      };            
    });

    beforeEach(() => {                    
      const mockHTMLTemplate = '<p> this is an html template </p> <input type="text"/>';
      
      fsSpy.appendFileSync = chai.spy();
      fsSpy.writeFileSync = chai.spy();
      fsSpy.readFileSync = chai.spy.returns(mockHTMLTemplate);
      
      component = proxyquire('../../src/components/codeGenerationComponent',{
        'fs': fsSpy,
        '../wrapper/dirnameWrappper': dirnameWrapperMock
      });
    });

    it('should cleanup the content of the component html file', () => {      
      component.generateHTML(mockConfiguration);  

      expect(fsSpy.writeFileSync).to.have.been.called.with(mockComponentHTMLFilePath, '');

    });

    it('should initiate the form (html/form-start.html template) on the component html file', () => {            
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/form-start.html';         

      component.generateHTML(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.called.with(mockComponentHTMLFilePath);
    });

    it('should create a text field (html/text-input.html template) for every string field', () => {      
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/text-input.html';
      const mockHTMLTemplate = '<input type="text"/>';

      fsSpy.readFileSync = chai.spy.returns(mockHTMLTemplate);
 
      component.generateHTML(mockConfiguration);  

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.second.called.with(mockComponentHTMLFilePath, mockHTMLTemplate);
      expect(fsSpy.appendFileSync).to.have.been.third.called.with(mockComponentHTMLFilePath, mockHTMLTemplate);      
    });

    it('should replace the FIELD_DISPLAY_NAME constant within the template file for text fields with the fields name', () => {      
      const mockHTMLTemplate = new String('FIELD_DISPLAY_NAME <input type=\"text\"/>');
      mockHTMLTemplate.toString = chai.spy.returns(mockHTMLTemplate);
      mockHTMLTemplate.replace = chai.spy.returns(new String(''));

      fsSpy.readFileSync = chai.spy.returns(mockHTMLTemplate);
 
      component.generateHTML(mockConfiguration);  
      
      expect(mockHTMLTemplate.replace).to.have.been.called.with(/FIELD_DISPLAY_NAME/g, mockConfiguration.fields[0].name);
      expect(mockHTMLTemplate.replace).to.have.been.called.with(/FIELD_DISPLAY_NAME/g, mockConfiguration.fields[1].name);
      expect(mockHTMLTemplate.replace).to.not.have.been.called.with(/FIELD_DISPLAY_NAME/g, mockConfiguration.fields[2].name);      
    });

    it('should replace the FIELD_NAME constant within the template file for text fields with the fields name', () => {      
      const mockHTMLTemplate = new String('FIELD_NAME <input type=\"text\"/>');
      mockHTMLTemplate.toString = chai.spy.returns(mockHTMLTemplate);
      mockHTMLTemplate.replace = chai.spy.returns(mockHTMLTemplate);

      fsSpy.readFileSync = chai.spy.returns(mockHTMLTemplate);
 
      component.generateHTML(mockConfiguration);  
      
      expect(mockHTMLTemplate.replace).to.have.been.called.with(/FIELD_NAME/g, mockConfiguration.fields[0].name);
      expect(mockHTMLTemplate.replace).to.have.been.called.with(/FIELD_NAME/g, mockConfiguration.fields[1].name);
      expect(mockHTMLTemplate.replace).to.not.have.been.called.with(/FIELD_NAME/g, mockConfiguration.fields[2].name);      
    });

    it('should close the form (html/form-end.html template) after all fields are created', () => {            
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/form-end.html';         

      component.generateHTML(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.called.with(mockComponentHTMLFilePath);      
    });    
  });

  describe('generateModel', () => {
    beforeEach(() => {     
      const mockTsTemplate = new String('\n <Typescript content goes here> \n');

      fsSpy.existsSync = chai.spy.returns(true);
      fsSpy.mkdirSync = chai.spy();  
      fsSpy.writeFileSync = chai.spy();
      fsSpy.readFileSync = chai.spy.returns(mockTsTemplate);

      component = proxyquire('../../src/components/codeGenerationComponent',{
        'fs': fsSpy,
        '../wrapper/dirnameWrappper': dirnameWrapperMock   
      });
    });

    it('should create a model folder given no model folder exists on the project', () => {      
      var mockModelDirectoryPath = process.cwd() + '/src/app/model';
      fsSpy.existsSync = chai.spy.returns(false);
      
      component.generateModel(mockConfiguration);      
      
      expect(fsSpy.mkdirSync).to.have.been.called.with(mockModelDirectoryPath);      
    });


    it('should create the typescript model on the model folder given an entity on the configuration', () => {                   
      var mockModelFilePath = process.cwd() + '/src/app/model/Person.ts';

      component.generateModel(mockConfiguration);      

      expect(fsSpy.writeFileSync).to.have.been.called.with(mockModelFilePath, '');
    });

    it('should declare the class with the entity\'s name on the first line of the ts file', () => {      
      const SECOND_CALL = 1;
      const SECOND_PARAMETER = 1;
      const FIRST_LINE = 0;  
      const WRITE_FILE_SPY_CALLS = fsSpy.writeFileSync.__spy.calls;
      
      component.generateModel(mockConfiguration);

      linesWritten = WRITE_FILE_SPY_CALLS[SECOND_CALL][SECOND_PARAMETER].split('\n');    
    
      expect(linesWritten[FIRST_LINE]).to.equal('export class Person {')
    });

    it('should create getters and setters using a template file (ts/model-property.ts template)', () => {                               
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/ts/model-property.ts';

      component.generateModel(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.once.with(mockTemplateFilePath);
    });

    it('should create a getter and setter for every field replacing the FIELD_NAME and FIELD_TYPE with the field metadata', () => {
      const mockTsTemplate = new String('private FIELD_NAME: FIELD_TYPE ');
      mockTsTemplate.toString = chai.spy.returns(mockTsTemplate);
      mockTsTemplate.replace = chai.spy.returns(mockTsTemplate);
      
      fsSpy.readFileSync = chai.spy.returns(mockTsTemplate);

      component.generateModel(mockConfiguration);      

      expect(mockTsTemplate.replace).on.nth(1).be.called.with(/FIELD_NAME/g, mockConfiguration.fields[0].name);
      expect(mockTsTemplate.replace).on.nth(2).be.called.with(/FIELD_TYPE/g, mockConfiguration.fields[0].type.toLowerCase());
      expect(mockTsTemplate.replace).on.nth(3).be.called.with(/FIELD_NAME/g, mockConfiguration.fields[1].name);
      expect(mockTsTemplate.replace).on.nth(4).be.called.with(/FIELD_TYPE/g, mockConfiguration.fields[1].type.toLowerCase());
      expect(mockTsTemplate.replace).on.nth(5).be.called.with(/FIELD_NAME/g, mockConfiguration.fields[2].name);
      expect(mockTsTemplate.replace).on.nth(6).be.called.with(/FIELD_TYPE/g, mockConfiguration.fields[2].type.toLowerCase());
    });
    
    it('should close the model class on the last line of the tsfile', () => {      
      const SECOND_CALL = 1;
      const SECOND_PARAMETER = 1;
      const WRITE_FILE_SPY_CALLS = fsSpy.writeFileSync.__spy.calls;
      
      component.generateModel(mockConfiguration);

      linesWritten = WRITE_FILE_SPY_CALLS[SECOND_CALL][SECOND_PARAMETER].split('\n');    
      const LAST_LINE = linesWritten.length - 1;      

      expect(linesWritten[LAST_LINE]).to.equal('}')
    });
  });
});