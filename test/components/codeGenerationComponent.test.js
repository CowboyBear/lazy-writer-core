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
          { name: 'notString', type: 'potato'}
        ]      
      };            
    });

    beforeEach(() => {              
      fsSpy.readFileSync = chai.spy();
      fsSpy.appendFileSync = chai.spy();
      fsSpy.writeFileSync = chai.spy();
      
      component = proxyquire('../../src/components/codeGenerationComponent',{
        'fs': fsSpy,
        '../wrapper/dirnameWrappper': dirnameWrapperMock
      });
    });

    it('should cleanup the content of the component html file', () => {      
      component.generateHTML(mockConfiguration);  

      expect(fsSpy.writeFileSync).to.have.been.called.with(mockComponentHTMLFilePath, '');

    });

    it('should initiate the form (form-start.html template) on the component html file', () => {            
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/form-start.html';         

      component.generateHTML(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.called.with(mockComponentHTMLFilePath);
    });

    it('should create a text field (text-input.html template) for every string field', () => {      
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/text-input.html';
      const mockHTMLTemplate = "<input type=\"text\"/>";
      fsSpy.readFileSync = chai.spy.returns(mockHTMLTemplate);
 
      component.generateHTML(mockConfiguration);  

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.second.called.with(mockComponentHTMLFilePath, mockHTMLTemplate);
      expect(fsSpy.appendFileSync).to.have.been.third.called.with(mockComponentHTMLFilePath, mockHTMLTemplate);
    });

    it('should close the form (form-end.html template) after all fields are created', () => {            
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/form-end.html';         

      component.generateHTML(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.called.with(mockComponentHTMLFilePath);
    });
  });
});