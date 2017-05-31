/*
script to build object dictionary from dictionary txt files
*/

'use strict';

const fs = require('fs');

let wordsHash = {};

function createInitialHashDictionary() {
  // loop thru length dictionary files
  for (var length = 1; length < 25; length++) {
    let path = `./dictionary-txt/${length}-letter-words.txt`;

    /* data is a buffer, need to convert to usable data(string).
    O(num of words in list) time + space */
    fs.readFile(path, "utf8", (err, data) => {
      let wordsArr = data.split('\n');

      // loop to create hash of arr of word's letters as val
      // under-index to discard linebreak char
      for (var j = 0; j < wordsArr.length - 1; j++) {
        let word = wordsArr[j];
        wordsHash[j] = word.split('');
      }

      console.log(wordsHash);

      let endPath =  `./dictionary-hash/${length}-letter.json`;

      fs.writeFileSync(endPath, JSON.stringify(wordsHash, null, 2) , 'utf-8');
    });
  }

}

createInitialHashDictionary();
