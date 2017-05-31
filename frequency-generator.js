'use strict';

const fs = require('fs');
let path = './dictionary/2-letter-words.txt';

let wordsHash = {};

function createInitialHashDictionary() {
  /* data is a buffer, need to convert to usable data
  (string). O(num of words in list) time + space */
  fs.readFile(path, "utf8", (err, data) => {
    let wordsArr = data.split('\n');

    // loop to create hash of arr of word's letters as val
    // under-index to discard linebreak char
    for (var i = 0; i < wordsArr.length - 1; i++) {
      let word = wordsArr[i];
      wordsHash[i] = word.split('');
    }

    console.log(wordsHash);
  });
}
