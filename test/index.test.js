var proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

chai.use(spies);

var minimistMock = function(args){ console.log(args)};
var cli;
var minimistSpy;

describe('CLI', function() {
  describe('main()', function() {
    before(() => {
      minimistSpy = chai.spy(minimistMock);

      cli = proxyquire('../src/index', {
        'minimist': minimistMock
      });
    });

    it('should parse arguments using minimist when called', function() {
      var cliArguments = ['some/path', 'another/path', '-f', 'template.yaml'];
      
      cli.main(cliArguments);
      
      expect(minimistSpy).to.have.been.called;
    });
  });
});