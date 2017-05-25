'use strict';
// post request to fetch new word
  // save word length
  // save status
// feed letters until status inactive
// append word to length list

var request = require('request');
const Promise = require('promise');
const fs = require('fs');
const config = require('./config');

const Letters = [ 'e', 'a', 'r', 'i', 'o', 't', 'n',
 's', 'l', 'c', 'u', 'd', 'p', 'm', 'h', 'g', 'b',
  'f', 'y', 'w', 'k', 'v', 'x', 'z', 'j', 'q' ];

var wordLength, status = 'active', gameId;

function runGame() {
  let startPromise = new Promise(resolve => {
    startGame();
  });

  startPromise.then(feedLetters());
}

function startGame() {
  let url = "http://int-sys.usr.space/hangman/games/";
  request.post({url: url, formData: {email: config.email}},
    function(error, response, body) {
      if (error) return console.log('error:', error);

      let data = JSON.parse(body);
      gameId = data.gameId;
      wordLength = data.word.length;
      console.log('gameId:', gameId);
      console.log('length:', wordLength);
    }
  );
}

function feedLetters() {
  console.log('feedgameId:', "33af0955e68a");
  let url = `http://int-sys.usr.space/hangman/games/33af0955e68a/guesses`;

  console.log('--- starting letter feed ---');

  let i = 0;
  // for (var i = 0; i < Letters.length; i++) {
  while (status === 'active') {
    let currentLetter = Letters[i];
    console.log(currentLetter);
    guessLetter(url, currentLetter);
    i++;
  }
}

function guessLetter(url, currentLetter) {
  request.post({url: url, formData: {char: currentLetter}},
    function(error, response, body) {
      console.log("letter being guessed:", currentLetter);
      if (error) return console.log('error:', error);

      let data = JSON.parse(body);
      console.log('feed letter body:', body);

      if (data.status === 'inactive') {
        handleWord(data);
        status = 'inactive';
        // BREAK OUT OF FOR LOOP!
      }
    }
  );
}

function handleWord(data) {
  console.log('--- starting saveWord ---');
  let firstMsgWord = data.msg.split(" ").shift();
  let lastMsgWord = data.msg.split(" ").pop();

  let word = firstMsgWord === 'Congrats!' ? data.word : lastMsgWord;
  console.log("FOUND WORD:", word);
}

function saveWord(word){
  let length = word.length;
  let path = `./dictionary/${length}-letter-words.txt`;
  fs.appendFile(path, word, (err) => {
    if (err) console.log(err);
    console.log(`${word} was added to ${path}`);
  });
}

// feedLetters();
writeWord("morsal");
