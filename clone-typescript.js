const path = require('path');
const fs = require('fs-extra');

let tscFileText = fs.readFileSync(path.join(__dirname, 'node_modules', 'typescript', 'lib', 'tsc.js'), 'utf8');
tscFileText = tscFileText.replace(
    `"use strict";`,
    `"use strict";
const _require = require;
require = (modName) => {
    const mod = _require(modName);
    if (modName === 'fs') {
        const proxy = { ...mod };
        const handler = {
            apply: function (target, thisArg, argumentsList) {
                if (typeof argumentsList[0] === 'string') {
                    const path = _require('path');
                    const relative = path.relative(__dirname, argumentsList[0]);
                    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
                        const tsPath = _require.resolve('typescript');
                        const tsLibPath = path.dirname(tsPath);
                        argumentsList[0] = path.resolve(tsLibPath, relative);
                    }
                }
                return target.apply(thisArg, argumentsList);
            }
        };
        for (let key in mod) {
            if (typeof mod[key] === 'function') {
                proxy[key] = new Proxy(mod[key], handler);
            }
        }
        return proxy;
    }
    return mod;
};
`,
);
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
fs.outputFile(path.join(__dirname, 'typescript', 'lib', 'tsc.js'), tscFileText);
