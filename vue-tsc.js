#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const volarPath = path.join(__dirname, 'volar');

if (fs.existsSync(volarPath)) {
    require('./typescript/lib/tsc.js');
}
else {
    const unzipper = require('unzipper');

    fs.createReadStream(path.join(__dirname, 'volar.vsix'))
        .pipe(unzipper.Extract({ path: path.join(__dirname, 'volar') }))
        .on('finish', () => {
            require('./typescript/lib/tsc.js');
        });
}
