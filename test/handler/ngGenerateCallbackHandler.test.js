const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;
const handler = require('../../src/handler/ngGenerateCallbackHandler');
const proxyquire = require('proxyquire');

var codeGenerationComponentMock = {};
var NgGenerateCallBackHandler;

describe('ngGenerateCallbackHandler', () => {
  describe('handle()', () => {
    before(() => {         
      chai.use(spies);            
    });

    beforeEach(() => {
      console.log = chai.spy.returns((str) => {});
      codeGenerationComponentMock.generateHTML = chai.spy.returns((configuration) => {});   
      
      NgGenerateCallBackHandler = proxyquire('../../src/handler/ngGenerateCallbackHandler', {
        '../components/codeGenerationComponent': codeGenerationComponentMock
      });

    });

    it('should log that the angular components were successfully created given no errors occured', () => {
      var callbackHandler = new NgGenerateCallBackHandler(null, null);

      callbackHandler.handle(null, null, null);

      expect(console.log).to.have.been.called.with('Angular component created!');
    });

    it('should log stderr given an error occured', () => {
      const error = 'error';
      const stderr = 'God dammit this is an error';
      var callbackHandler = new NgGenerateCallBackHandler(null, null);

      callbackHandler.handle(error, null, stderr);      

      expect(console.log).to.have.been.called.with('Error while creating entity: ', stderr);
    });

    it('should delegate HTML code generation to codeGenerationComponent given no errors occured', () => {
      var mockConfiguration = {thisIsA: 'Mock'};
      var callbackHandler = new NgGenerateCallBackHandler(mockConfiguration, null);

      callbackHandler.handle(null, null, null);

      expect(codeGenerationComponentMock.generateHTML).to.have.been.called.with(mockConfiguration);
    });
  });
});