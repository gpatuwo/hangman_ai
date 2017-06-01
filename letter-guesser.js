'use strict';

const frequencyGenerator = require('./frequency-generator.js');
const request = require('request');
const fs = require('fs');
const config = require('./config');

// vars for testing
const JsonDict = require(`./dictionary-json/10-letter.json`);
console.log('words hash created');

let guessesLeft = 10;
let length = 8;
let guessUrl = "http://int-sys.usr.space/hangman/games/02dce4466aa0/guesses";
let gameStatus = 'active';
let lettersGuessed = {};

letterGuesser(JsonDict, length, guessUrl);

function letterGuesser(wordsHash, wordLength, url, i = 0) {
  console.log("<------ starting letterGuesser ------>");

  if (gameStatus === 'inactive') return;

  let freqList = frequencyGenerator(wordsHash, wordLength);
  console.log('freqList:', JSON.stringify(freqList));

  // if already guessed letter, then go to next letter;
  while (lettersGuessed[freqList[i]]) {
    i++;
  }

  request.post({url: url, formData: {char: freqList[i]}},
    function cb(error, response, body) {
      if (error) return console.log('post request error:', error);

      lettersGuessed[freqList[i]] = true;
      console.log('lettersGuessed:', lettersGuessed);

      let data = JSON.parse(body);
      gameStatus = data.status;
      console.log('feed letter body:', data);

      // loop gets first letter correct
      if (data.guessesLeft === guessesLeft) {
        // filters list to make new guess
        console.log('jumping into recursive call');
        let currentWord = data.word;
        let newWords = filterWords(wordsHash, currentWord, length);
        letterGuesser(newWords, url, 0);
      } else if (data.status === 'inactive') {
        return console.log('finished game');
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
