'use strict';

const fs = require('fs');
let path = './dictionary/2-letter-words.txt';

// data is a buffer, need to convert to usable data structure (string)
fs.readFile(path, "utf8", (err, data) => {
  let wordsArr = data.split('\n');
  let wordsHash = {0: ['m'], 1: ['e']};

  for (var i = 1; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    for (var j = 0; j < word.length; j++) {
      wordsHash[j] = wordsHash[j].concat(word[j]);
    }
  }

  console.log(wordsHash[0][0]);
});
