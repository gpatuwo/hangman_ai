'use-strict';


function filterWords(){
  let dictionaryLength = Object.keys(currentDictionary).length;
  let yesWrongGuess = didWrongGuess();

  guessesLeftBeforeRequest = responseBody.guessesLeft;

  // if it's the first guess
  if (dictionaryLength === parseInt(nextWordKey)) return;

  // if no words in dict match
  if (dictionaryLength === 0) return;

  // if there's one word and guessed a letter that didn't work,
  if (dictionaryLength === 1 && yesWrongGuess) {
    currentDictionary = {};
    return;
  }


  if (yesWrongGuess) {
    filterOutWords();
  } else {
    let newlettersIdx = findNewLettersIdx();
    filterForWords(newlettersIdx);
  }
}

// GET RID of words that do have lastGuessedLetter
function filterOutWords(){
  let filteredWords = {};

  for (var key in currentDictionary){
    if (currentDictionary.hasOwnProperty(key)) {
      let word = currentDictionary[key];

      // save word if does not have lastGuessedLetter
      if (word.indexOf(lastGuessedLetter) === -1) {
        filteredWords[key] = word;
      }
    }
  }

  currentDictionary = filteredWords;
}

// KEEP words that do have lastGuessedLetter in newlettersIdx
function filterForWords(newlettersIdx){
  let filteredWords = {};

  for (var key in currentDictionary) {
    if (currentDictionary.hasOwnProperty(key)) {
      let word = currentDictionary[key];

      let shouldInsertWord = false;

      for (var i = 0; i < newlettersIdx.length; i++) {
        let idx = newlettersIdx[i];
        let letter = word[idx];
        // console.log('letter:', letter);
        if (letter === lastGuessedLetter) {
          console.log(`${letter} is present in ${word}`);
          shouldInsertWord = true;
        } else if (letter !== lastGuessedLetter &&
          i === newlettersIdx.length - 1) {
          shouldInsertWord = false;
        } else {
          console.log(`breaking out of newlettersIdx loop`);
          shouldInsertWord = false;
          // skip to next word;
          break;
        }
      }

      // here means went thru word and all letters match
      if (shouldInsertWord === true) filteredWords[key] = word;
    }
  }

  // currentDictionary = filteredWords;
  return filteredWords;
}

function didWrongGuess(){
  return guessesLeftBeforeRequest > responseBody.guessesLeft;
}

let currentDictionary = {
  0: [ 'c', 'a', 'y', 'e', 'b', 'b', 'b', 'b', 'b', 'e' ],
  1: [ 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z', 'z' ],
  2: [ 'l', 'i', 'm', 'i', 'c', 'o', 'l', 'i', 'n', 'e' ],
  3: [ 'u', 'n', 'd', 'e', 'r', 't', 'r', 'i', 'b', 'e' ],
  4: [ 'o', 's', 't', 'e', 'o', 'm', 'e', 't', 'r', 'y' ]
};
let lettersIdx = [3, 9];
let lastGuessedLetter = 'e';
console.log(filterForWords(lettersIdx));

let guessesLeftBeforeRequest = 10;
let responseBody = {guessesLeft: 10};
let nextWordKey;
let findNewLettersIdx;
