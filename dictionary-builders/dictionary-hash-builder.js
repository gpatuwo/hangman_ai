// convert json dictionary into object

'use strict';

const fs = require('fs');

module.exports = function createHashDictionary(length) {
  let path = `./dictionary-json/${length}-letter.json`;

 return JSON.parse(fs.readFileSync(path, "utf8"));
};
