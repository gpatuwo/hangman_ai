/*
script to build object dictionary from dictionary txt files
*/

'use strict';

const fs = require('fs');

let wordsHash = {};

function createInitialJsonDictionary() {

  let length = 4;
  let path = `./dictionary-txt/${length}-letter-words.txt`;
  /* data is a buffer, need to convert to usable data(string).
  O(num of words in list) time + space */
  fs.readFile(path, "utf8", function cb(err, data){
    let wordsArr = data.split('\n');

    // loop to create hash of arr of word's letters as val
    // under-index to discard linebreak char
    for (var j = 0; j < wordsArr.length - 1; j++) {
      let word = wordsArr[j];
      wordsHash[j] = word.split('');
    }

    console.log(wordsHash);

    let endPath =  `./dictionary-hash/${length}-letter.json`;

    // have to stringify hash bc of writeFile can only export as string, buffer or arr
    fs.writeFileSync(endPath, JSON.stringify(wordsHash, null, 2) , 'utf-8');

    // loop thru length dictionary files
    if (length < 25) {
      length++;
      // need to reassign path bc of asycn callback
      path = `./dictionary-txt/${length}-letter-words.txt`;
      fs.readFile(path, "utf8", cb);
    } else {
      console.log(`created ${length} lists`);
    }
  });
}

createInitialJsonDictionary();
