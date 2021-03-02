const fs = require('fs');
const path = require('path');

const volarPath = path.resolve(path.join(__dirname, 'volar'));

if (fs.existsSync(volarPath)) {
    require('./typescript/lib/tsc.js');
}
else {
    const fs = require('fs');
    const unzipper = require('unzipper');

    fs.createReadStream(path.resolve(path.join(__dirname, 'volar.vsix')))
        .pipe(unzipper.Extract({ path: path.resolve(path.join(__dirname, 'volar')) }))
        .on('finish', () => {
            require('./typescript/lib/tsc.js');
        });
}
