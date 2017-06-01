/*
1. test if guessing logic works
2. change out request for xmlHttpRequest
*/

'use strict';

const createHashDictionary =
require('./dictionary-builders/dictionary-hash-builder.js');
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

      let words = createHashDictionary(length);
      console.log('words hash created');

      freqList = frequencyGenerator(words, length);
      console.log('freqList:', JSON.stringify(freqList));

      url += `${gameId}/guesses`;
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


let words = createHashDictionary(10);
console.log('words hash created');

freqList = frequencyGenerator(words, 10);

let guessesLeft = 10;

function feedInitialLetters(url, i = 0) {
  console.log(`guessing letter: ${freqList[i]}`);
  request.post({url: url, formData: {char: freqList[i]}},
    function cb(error, response, body) {
      if (error) return console.log('initial feed error:', error);

      let data = JSON.parse(body);
      console.log('feed letter body:', data);

      // loop gets first letter correct
      if (data.guessesLeft === 10) {
        // break out of loop
        return console.log('breaking out of loop');
      } else if (data.status === 'inactive') {
        return console.log('none of the letters work :( )');
      } else {
        // keep guessing
        request.post({url: url, formData: {char: freqList[++i]}}, cb);
      }
    }
  );
}

let guessUrl = "http://int-sys.usr.space/hangman/games/9c393441c596/guesses";

feedInitialLetters(guessUrl);
