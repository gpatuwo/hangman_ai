/*
1. test if guessing logic works
2. change out request for xmlHttpRequest
*/

'use strict';

// const createHashDictionary =
// require('./dictionary-builders/dictionary-hash-builder.js');
const frequencyGenerator = require('./frequency-generator.js');
const request = require('request');
const fs = require('fs');
const config = require('./config');

let gameId, length, freqList;

function startGame() {
  // request word
  let url = "http://int-sys.usr.space/hangman/games/";

  request.post({url: url, formData: {email: config.email}},
    (error, response, body) => {
      if (error) return console.log('post request error for new word:', error);

      console.log("<------ starting new game ------>");

      let data = JSON.parse(body);
      gameId = data.gameId;
      length = data.word.length;
      console.log('new game request body:', data);

      const jsonDictionary = require(`./dictionary-json/${length}-letter.json`);

      // saving this variable for easier insertion into dict
      const nextWordKey = Object.keys(jsonDictionary).length;
      // let words = createHashDictionary(length);
      console.log('words hash created');

      freqList = frequencyGenerator(jsonDictionary, length);
      console.log('freqList:', JSON.stringify(freqList));

      url += `${gameId}/guesses`;
      feedStaticLetters(jsonDictionary, url);
      /* guess letters logic here
      1. feed freqList[0]

      2. parse response:
        if no, go down freqList for next letter
        if yes,
          3. narrow down words list
          4. create new freqList
      */

    }
  );
}
// startGame();


const JsonDict = require(`./dictionary-json/10-letter.json`);
console.log('words hash created');

freqList = frequencyGenerator(JsonDict, 10);

let guessesLeft = 10;

// guessing from static freq list
function feedStaticLetters(url, i = 0) {
  console.log(`guessing letter: ${freqList[i]}`);
  request.post({url: url, formData: {char: freqList[i]}},
    function cb(error, response, body) {
      if (error) return console.log('initial feed error:', error);

      let data = JSON.parse(body);
      console.log('feed letter body:', data);

      // loop gets first letter correct
      if (data.guessesLeft === 10) {
        // break out of loop
        console.log('jumping into feedCustomLetters');
        let word = data.word;
        let newWords = filterWords(JsonDict, word, length);
        feedCustomLetters(newWords, url);
      } else if (data.status === 'inactive') {
        return console.log('none of the letters work :( )');
      } else {
        // keep guessing
        request.post({url: url, formData: {char: freqList[++i]}}, cb);
      }
    }
  );
}

// returns new words obj
function filterWords(wordsHash, currentWord, wordLength) {
  // parse currentWord, arr of idx w/letters
  let lettersIdx = findLettersIdx(currentWord, wordLength);
  let filteredWords = {};

  // itr through wordsHash to find matches
  for (var key in wordsHash) {
    if (wordsHash.hasOwnProperty(key)) {
      let word = wordsHash[key];

      // check if word matches letters
      let shouldInsertWord = false;

      for (var i = 0; i < lettersIdx.length; i++) {
        let idx = lettersIdx[i];

        if (word[idx] === currentWord[idx]) {
          shouldInsertWord = true;
        } else if ( i === lettersIdx.length - 1 &&
          word[idx] !== currentWord[idx]) {
          shouldInsertWord = false;
        } else {
          // skip to next word;
          break;
        }
      }

      // here means went thru word and all letters match
      if (shouldInsertWord === true) filteredWords[key] = word;
    }
  }

  return filteredWords;
}


function findLettersIdx(currentWord, wordLength) {
  let lettersIdx = [];

  for (let i = 0; i < wordLength; i++){
      if (currentWord[i] !== '_') lettersIdx.push(i);
  }

  return lettersIdx;
}

console.log(filterWords(JsonDict, '___e_____e', 10));

function feedCustomLetters() {

}

let guessUrl = "http://int-sys.usr.space/hangman/games/9c393441c596/guesses";

// feedStaticLetters(guessUrl);
feedCustomLetters(guessUrl);
