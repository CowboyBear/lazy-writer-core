var proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

const minimistMock = require('./mock/minimistMock');
const yamlJsMock = require('./mock/yamlJsMock');
const fsMock = require('./mock/fsMock');

var cli;
const cliArguments = ['some/path', 'another/path', '-f', 'template.yaml'];
var minimistSpy;
var yamlJsSpy;
var fsSpy;

describe('CLI', function() {
  describe('main()', function() {
    before(() => {      
      setupSpies();

      cli = proxyquire('../src/index', {
        'minimist': minimistMock,
        'js-yaml': yamlJsMock,
        'fs':fsMock
      });
    });

    it('should parse arguments using minimist when called', function() {            
      cli.main(cliArguments);
      
      expect(minimistSpy).to.have.been.called;
    });

    it('should read the template file using fs given the -f argument was passed', function() {            
      cli.main(cliArguments);      
    
      expect(fsSpy).to.have.been.called.with('/testPath/template.yaml', 'utf8');      
    });

    it('should interpret the template file using js-yaml given the -f argument was passed', function() {      
      cli.main(cliArguments);      
          
      expect(yamlJsSpy).to.have.been.called.with('Mock YAML Content');
    });
  });
});

function setupSpies() {
  chai.use(spies);
  
  process.cwd = chai.spy.returns('/testPath');
  minimistSpy = chai.spy(minimistMock);
  yamlJsSpy = chai.spy.on(yamlJsMock, 'safeLoad');
  fsSpy = chai.spy.on(fsMock, 'readFileSync');
}
