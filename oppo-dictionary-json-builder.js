/*
script to build object dictionary from dictionary txt files
*/

'use strict';

const fs = require('fs');

let wordsHash = {};

function createInitialJsonDictionary(length) {

  // let length = 10;
  let path = `./dictionary-txt/${length}-letter-words.txt`;

  fs.readFile(path, "utf8", function cb(err, data){
    let wordsArr = data.split('\n');

    // loop to create hash of arr of word's letters as val
    // under-index to discard linebreak char
    for (var i = 0; i < wordsArr.length - 1; i++) {
      let word = wordsArr[i];
      for (var j = 0; j < length; j++) {
        if (wordsHash[j]) {
          wordsHash[j].concat(word[j]);
        } else {
          wordsHash[j] = [word[j]];
        }
      }
    }

    // console.log(wordsHash);

    let endPath =  `./${length}-letter.json`;

    fs.writeFileSync(endPath, JSON.stringify(wordsHash, null, 2) , 'utf-8');
  });
}


createInitialJsonDictionary(2);

var jsonDict = require('./dictionary-json/2-letter.json');

console.log(jsonDict);
console.log(Object.keys(jsonDict).length);
