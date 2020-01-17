const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;
const handler = require('../../src/handler/ngGenerateCallbackHandler');

describe('ng generate callback handler', () => {
  describe('callback', () => {
    before(() => {         
      chai.use(spies);            
    });

    beforeEach(() => {
      console.log = chai.spy.returns((str) => {});
    });

    it('should log that the angular components were successfully created given no errors occured', () => {
      handler(null, null, null);
      expect(console.log).to.have.been.called.with('Angular component created!');
    });

    it('should log stderr given an error occured', () => {
      const error = 'error';
      const stderr = 'God dammit this is an error';

      handler(error, null, stderr);

      expect(console.log).to.have.been.called.with('Error while creating entity: ', stderr);
    });
  });
});