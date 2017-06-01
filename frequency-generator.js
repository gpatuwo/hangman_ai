'use strict';

const fs = require('fs');

function frequencyGenerator(words, length) {

  // words can be 'initialize dictionary' or already object
  if (typeof words === 'string') {
    words = createHashDictionary(length);
  }

  // loop through words to create lettersCount hash
  let lettersCount = countLetters(words, length);

  console.log(lettersCount);
  // reads LettersCount and puts letters in order
  let frequencyList = new Array(26);
}


// convert json dictionary into object
function createHashDictionary(length) {
  let path = `./dictionary-json/${length}-letter.json`;

  return JSON.parse( fs.readFileSync(path, "utf8") );
}

/* potential bottleneck?
  runtime: O(n * m),
    where n = num of words in list, m = word length
  space: O(1)
*/
function countLetters(words, length) {
  let countHash = {};

  for (var key in words) {
    // so loop doesn't get into props along prototype chain
    if (words.hasOwnProperty(key)) {
      let word = words[key];

      for (var i = 0; i < length; i++) {
        let letter = word[i];
        
        // create or add to letter's count
        countHash[letter] ? countHash[letter]++ : countHash[letter] = 1;
      }
    }
  }

  return countHash;
}

frequencyGenerator("words", 1);
