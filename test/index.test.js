var proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

const chalkMock = require('chalk');
const jsYamlSpy = {};
const fsSpy = {};
const childProcessSpy = {};
var minimistSpy = {};

var cli;
const cliArguments = ['some/path', 'another/path', '-f', 'template.yaml'];

describe('CLI', function() {
  describe('main()', function() {
    before(() => {         
      chai.use(spies);        
      process.cwd = chai.spy.returns('/testPath');       
    });

    beforeEach(() => {
      console.log = chai.spy.returns((str) => {});
      jsYamlSpy.safeLoad = chai.spy.returns({entity: 'Person'})  
      childProcessSpy.exec = chai.spy.returns((input, callback) => {});
      minimistSpy = chai.spy.returns({f: 'template.yaml'});
      fsSpy.readFileSync = chai.spy.returns('Mock YAML Content');

      cli = proxyquire('../src/index', {
        'minimist': minimistSpy,
        'js-yaml': jsYamlSpy,
        'fs':fsSpy,
        'chalk': chalkMock,
        'child_process': childProcessSpy
      });
    });

    it('should parse arguments using minimist when called', function() {            
      cli.main(cliArguments);
      
      expect(minimistSpy).to.have.been.called;
    });

    it('should read the template file using fs given the -f argument was passed', function() {             
      cli.main(cliArguments);      
    
      expect(fsSpy.readFileSync).to.have.been.called.with('/testPath/template.yaml', 'utf8');      
    });

    it('should interpret the template file using js-yaml given the -f argument was passed', function() {       
      cli.main(cliArguments);      
          
      expect(jsYamlSpy.safeLoad).to.have.been.called.with('Mock YAML Content');      
    });

    it('should print a red error message given the -f argument is missing', function() {      
      minimistSpy = chai.spy.returns({});
      var chalkSpy = chai.spy.on(chalkMock, "red");

      cli = proxyquire('../src/index', {
        'minimist': minimistSpy,
        'chalk': chalkMock
      });

      cli.main(cliArguments);            
      expect(chalkSpy).to.have.been.called;     
    });

    it('should print a red error message given the -f argument is incomplete', function() {      
      minimistSpy = chai.spy.returns({f: true});
      var chalkSpy = chai.spy.on(chalkMock, "red");

      cli = proxyquire('../src/index', {
        'minimist': minimistSpy,
        'chalk': chalkMock
      });

      cli.main(cliArguments);            
      expect(chalkSpy).to.have.been.called;     
    });

    it('should try to generate a new component given a valid template file', function() {      
      cli.main(cliArguments);            
      expect(childProcessSpy.exec).to.have.been.called.with('ng generate component Person');     
    });
  });
});
