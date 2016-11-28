const fs = require('fs-extra');


fs.remove('npm-debug.log*');
fs.removeSync('.dest-test/');
