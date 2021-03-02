const ts = require('typescript');
const path = require('path');
const fs = require('fs-extra');

const tsDirFrom = path.join(__dirname, 'node_modules', 'typescript');
const tsDirTo = path.join(__dirname, 'typescript');
const tscFile = path.join(tsDirTo, 'lib', 'tsc.js');

if (fs.existsSync(tsDirFrom)) {
    fs.copySync(tsDirFrom, tsDirTo);
    let tscFileText = ts.sys.readFile(tscFile);
    tscFileText = tscFileText.replace(
        `function createIncrementalProgram(_a) {`,
        `function createIncrementalProgram(_a) { throw 'incremental mode is not yet support';`,
    );
    tscFileText = tscFileText.replace(
        `function createWatchProgram(host) {`,
        `function createWatchProgram(host) { throw 'watch mode is not yet support';`,
    );
    tscFileText = tscFileText.replace(
        `function createProgram(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) {`,
        `function createProgram(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) { return require('../../proxy').createProgramProxy(...arguments);`,
    );
    ts.sys.writeFile(tscFile, tscFileText);
}
