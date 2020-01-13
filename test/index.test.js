var proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

var minimistMock = require('./mock/minimistMock');
const yamlJsMock = require('./mock/yamlJsMock');
const fsMock = require('./mock/fsMock');
const chalkMock = require('chalk');

var cli;
const cliArguments = ['some/path', 'another/path', '-f', 'template.yaml'];
var minimistSpy;
var yamlJsSpy;
var fsSpy;
var chalkSpy;

describe('CLI', function() {
  describe('main()', function() {
    before(() => {   
      chai.use(spies);  
      process.cwd = chai.spy.returns('/testPath');       
    });

    beforeEach(() => {
      cli = proxyquire('../src/index', {
        'minimist': minimistMock,
        'js-yaml': yamlJsMock,
        'fs':fsMock,
        'chalk': chalkMock
      });
    });

    it('should parse arguments using minimist when called', function() {            
      minimistSpy = chai.spy(minimistMock);

      cli.main(cliArguments);
      
      expect(minimistSpy).to.have.been.called;
    });

    it('should read the template file using fs given the -f argument was passed', function() {       
      fsSpy = chai.spy.on(fsMock, 'readFileSync');

      cli.main(cliArguments);      
    
      expect(fsSpy).to.have.been.called.with('/testPath/template.yaml', 'utf8');      
    });

    it('should interpret the template file using js-yaml given the -f argument was passed', function() { 
      yamlJsSpy = chai.spy.on(yamlJsMock, 'safeLoad');

      cli.main(cliArguments);      
          
      expect(yamlJsSpy).to.have.been.called.with('Mock YAML Content');      
    });

    it('should print a red error message given the -f argument is missing', function() {      
      minimistMock = chai.spy.returns({});
      chalkSpy = chai.spy.on(chalkMock, "red");

      cli = proxyquire('../src/index', {
        'minimist': minimistMock,
        'chalk': chalkMock
      });

      cli.main(cliArguments);            
      expect(chalkSpy).to.have.been.called;     
    });

    it('should print a red error message given the -f argument is incomplete', function() {      
      minimistMock = chai.spy.returns({f: true});
      chalkSpy = chai.spy.on(chalkMock, "red");

      cli = proxyquire('../src/index', {
        'minimist': minimistMock,
        'chalk': chalkMock
      });

      cli.main(cliArguments);            
      expect(chalkSpy).to.have.been.called;     
    });
  });
});
