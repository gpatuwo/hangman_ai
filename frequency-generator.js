// analyzes given words, returns frequency list array

'use strict';

const fs = require('fs');

module.exports = function frequencyGenerator(words, length) {

  // loop through words to create lettersCount hash
  let lettersCount = countLetters(words, length);

  // reads LettersCount and puts letters in order
  let frequencyList =
    Object.keys(lettersCount).sort( (a,b) => lettersCount[b] - lettersCount[a]);

  return frequencyList;
};


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
