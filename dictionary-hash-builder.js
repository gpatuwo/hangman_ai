// convert json dictionary into object

'use strict';
const fs = require('fs');

function createLengthDictionary(length) {
  let path = `./dictionary-json/${length}-letter.json`;

  // exports dictionary as object
  return JSON.parse( fs.readFileSync(path, "utf8") );

}
