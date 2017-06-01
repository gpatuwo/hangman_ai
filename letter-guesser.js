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
      */

    }
  );
}

function feedLetters(url) {

}

startGame();
