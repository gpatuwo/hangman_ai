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
      // console.log('gameId:', gameId);
      // console.log('length:', wordLength);

      url += `${gameId}/guesses`;
      console.log("<------ starting feedLetters ------>");
      feedLetters(url);
    }
  );
}

function feedLetters(url) {
  request.post({url: url, formData: {char: Letters.shift()}},
    function cb(error, response, body) {
      if (error) return console.log('error:', error);

      let data = JSON.parse(body);
      console.log('feed letter body:', body);
      // console.log("letters now", Letters);

      if (data.status === 'inactive') {
        // BREAKS OUT OF FOR LOOP! :D
        handleWord(data);
      } else {
        console.log("making another post req");
        request.post({url: url, formData: {char: Letters.shift()}}, cb);
      }
    }
  );
}

function handleWord(data) {
  console.log("<------ starting handleWord ------>");
  let firstMsgWord = data.msg.split(" ").shift();
  let lastMsgWord = data.msg.split(" ").pop();

  let word = firstMsgWord === 'Congrats!' ? data.word : lastMsgWord;
  console.log("FOUND WORD:", word);

  saveWord(word);
}

function saveWord(word){
  let length = word.length - 1;
  let path = `./dictionary/${length}-letter-words.txt`;
  word += '\n';

  fs.readFile(path, (err, data) => {
    if (err) console.log(err);
    if (data.indexOf(word) >= 0) {
      console.log("you've seen this word before!");
      fs.appendFile('./dictionary/seen-words.txt', word);
    } else {
      fs.appendFile(path, word, (err2) => {
        if (err2) console.log(err2);
        console.log(`${word} was added to ${path}`);
      });

      //to keep count how many words have been seen
      fs.appendFile('./dictionary/all-words.txt', word, () => {
        console.log(`${word} was added to all words`);
      });
    }
  });
}

startGame();
