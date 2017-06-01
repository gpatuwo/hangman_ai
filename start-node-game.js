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
// const letterGuesser = require('./letter-guesser.js');

let gameId, length, freqList, jsonDictionary, nextWordKey;

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


      jsonDictionary = require(`./dictionary-json/${length}-letter.json`);
      // saving this variable for easier insertion into dict
      nextWordKey = Object.keys(jsonDictionary).length;
      // let words = createHashDictionary(length);
      console.log('words hash created');

      url += `${gameId}/guesses`;

      // letterGuesser(jsonDictionary, url);
    }
  );
}

startGame();
