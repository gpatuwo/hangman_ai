// convert json dictionary into object

'use strict';

const fs = require('fs');

function createHashDictionary(length) {
  let path = `./dictionary-json/${length}-letter.json`;

 fs.readFile(path, "utf8", (err, data) => {
    if (err) console.log(err);
    console.log(data);
 });
}

createHashDictionary(10);
