/* to dos:
  - refactor inputs!!!!!!
  - recursive call on line 73?
  - invoke initial game request in constructor
*/
'use strict';

const frequencyGenerator = require('./frequency-generator.js');
const request = require('request');
const fs = require('fs');
const config = require('./config');
const OxfordList = [ 'e', 'a', 'r', 'i', 'o', 't', 'n',
 's', 'l', 'c', 'u', 'd', 'p', 'm', 'h', 'g', 'b',
  'f', 'y', 'w', 'k', 'v', 'x', 'z', 'j', 'q' ];

// vars for testing
// const JsonDict = require(`./dictionary-json/15-letter.json`);
// console.log('words hash created');
//
// let guessesLeft = 10;
// let length = 15;
// let guessUrl = "http://int-sys.usr.space/hangman/games/5530534a4274/guesses";
// let gameStatus = 'active';
// let lettersGuessed = {};
//
// letterGuesser(JsonDict, guessUrl);

// module.exports =
// length, gameStatus, lettersGuessed, guessesLeft,
module.exports = function letterGuesser(wordsHash, length,
   gameStatus, lettersGuessed, guessesLeft, url, i = 0) {
  console.log("<------ starting letterGuesser ------>");

  if (gameStatus === 'inactive') return;

  let freqList = frequencyGenerator(wordsHash, length);
  console.log('freqList:', freqList);

  // if already guessed letter, then go to next letter;
  while (lettersGuessed[freqList[i]]) {
    i++;
  }

  console.log('i before post request:', i);
  console.log('guessesLeft:', guessesLeft);

  request.post({url: url, formData: {char: freqList[i]}},
    function cb(error, response, body) {
      let data = JSON.parse(body);
      if (data.error) console.log('post request error:', data.error);

      lettersGuessed[freqList[i]] = true;

      gameStatus = data.status;
      console.log('feed letter body:', data);

      let currentWord = data.word;
      let newWords = filterWords(wordsHash, currentWord, length);
      console.log('newWords:', JSON.stringify(newWords));

      // if guessed correct letter
      if (data.guessesLeft === guessesLeft) {
        // filters list to make new guess

        // there's one word left
        if (Object.keys(newWords).length === 1 ){
          console.log('one word left!');
          freqList = frequencyGenerator(newWords, length);
          console.log('freqList:', freqList);

          i = 0;
          console.log('reassigns i:', i);

          while (lettersGuessed[freqList[i]]) {
            i++;
          }
          if (i >= freqList.length ) {
            console.log('out of freqList guesses');
            guessDownOxfordList(lettersGuessed, url);
          } else {
          request.post({url: url, formData: {char: freqList[i]}}, cb);
          }
        }
        // // there's no words left
        else if (Object.keys(newWords).length === 0) {
          console.log('no words in dict left');
          guessDownOxfordList(lettersGuessed, url);
        }
        // guessed correct letter, do it again
        else {
          console.log('jumping into letter guesser again');
          letterGuesser(newWords, length, gameStatus,
             lettersGuessed, guessesLeft, url, 0);
        }}
      // if game over
      else if (data.status === 'inactive') {
        return console.log('finished game');}
      // if guessed wrong; keep guessing
      else {
        guessesLeft--;
        // none of the words match -> new word!
        // if (Object.keys(newWords).length === 0 &&
        //  currentWord === '_'.repeat(length)) {
        //   guessDownOxfordList(lettersGuessed, url);
        // }
        // else {
          while (lettersGuessed[freqList[i]]) {
            i++;
          }
          if (i >= freqList.length ) {
            console.log('out of freqList guesses');
            guessDownOxfordList(lettersGuessed, url);
          } else {
            request.post({url: url, formData: {char: freqList[i]}}, cb);
          }
        // }
      }
    }
  );
};

// new word!
function guessDownOxfordList(guessed, url, i = 0) {
  console.log("<------ starting guessDownOxfordList ------>");
  while (guessed[OxfordList[i]]) {
    i++;
  }

  request.post({url: url, formData: {char: OxfordList[i]}},
    function cb(error, response, body) {
      if (error) return console.log('post request error:', error);

      let data = JSON.parse(body);
      console.log('feed letter body:', body);
      // console.log("letters now", Letters);

      if (data.status === 'inactive') {
        // BREAKS OUT OF FOR LOOP! :D
        // handleWord(data);
        console.log('finished game');
      } else {
        console.log("making another post req");
        // not recursive bc it's happening asychroniously
        guessed[OxfordList[i]] = true;
        request.post({url: url, formData: {char: OxfordList[++i]}}, cb);
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
          shouldInsertWord = false;
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
