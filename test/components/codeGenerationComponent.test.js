const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;
const proxyquire = require('proxyquire');
const fsSpy = {};
const dirnameWrapperMock = '/mock/relative/path';
var component;

describe('codeGenerationComponent', () => {
  describe('generateHTML()', () => {
    before(() => {         
      chai.use(spies);            
    });

    beforeEach(() => {
      process.cwd =  chai.spy.returns('/mock/base/path');      
      
      fsSpy.readFileSync = chai.spy();
      fsSpy.appendFileSync = chai.spy();
      fsSpy.writeFileSync = chai.spy();
      
      component = proxyquire('../../src/components/codeGenerationComponent',{
        'fs': fsSpy,
        '../wrapper/dirnameWrappper': dirnameWrapperMock
      });
    });

    it('should cleanup the content of the component html file', () => {
      var mockComponentHMTLFilePath = '/src/app/person/person.component.html';
      
      var mockConfiguration = {
        entity: "Person"
      };  

      component.generateHTML(mockConfiguration);  

      expect(fsSpy.writeFileSync).to.have.been.called.with(process.cwd() + mockComponentHMTLFilePath, '');

    });

    it('should read from the form-start HTML template and print it to the component html file ', () => {      
      var mockComponentHMTLFilePath = '/src/app/person/person.component.html';
      var mockTemplateFilePath = dirnameWrapperMock + '/../assets/templates/html/form-start.html';

      var mockConfiguration = {
        entity: "Person"
      };              

      component.generateHTML(mockConfiguration);      

      expect(fsSpy.readFileSync).to.have.been.called.with(mockTemplateFilePath);
      expect(fsSpy.appendFileSync).to.have.been.called.with(process.cwd() + mockComponentHMTLFilePath);
    });
  });
});