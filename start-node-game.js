'use strict';

const request = require('request');
const fs = require('fs');

class Game {
  constructor(){
    this.gameId = '';
    this.wordLength = 0;
    this.jsonDictionary = {};
    this.nextWordKey = '';
    this.isNewWord = false;
    this.gameStatus = 'active';
    this.lettersGuessed = {};
    this.guessesLeftBeforeRequest = 10;
    this.url = "http://int-sys.usr.space/hangman/games/";

    this.currentDictionary = {};
    this.freqList = [];
    this.lastGuessedLetter = '';
    this.responseBody = {};
    this.responseWord = '';

    this.setupGame();
  }

  setupGame(){
    let email = 'hangman@gmail.com';

    request.post({url: this.url, formData: {email: email}},
      (error, response, body) => {
      if (error) return console.log('post request error for new word:', error);

      console.log("<------ starting new game ------>");

      let data = JSON.parse(body);
      this.responseBody = data;
      this.gameId = data.gameId;
      this.wordLength = data.word.length;

      console.log('responseBody:', this.responseBody);

      this.jsonDictionary =
        require(`./dictionary-json/${this.wordLength}-letter.json`);
      this.nextWordKey = Object.keys(this.jsonDictionary).length;

      this.currentDictionary =
       require(`./dictionary-json/${this.wordLength}-letter.json`);
      this.updateFreqList();

      console.log('initial freqList:', JSON.stringify(this.freqList));

      this.url += `${this.gameId}/guesses`;

      //playRound();
    });
    // make post request. in cb:
      // updates responseBody
      // update ivars, incl freqList via updateFreqList();
      // fe: re-enable guess-button
      // node: playRound()
  }

  playRound(){
    // populate/reassign currentDictionary via filterWords(responseWord)

    // updateFreqList

    // last letter guessed = freqList[0];

    // fe: disable guess-button

    // make request. in cb:
      // push letter to lettersGuessed
      // update responseBody
      // fe: re-enable guess-button
      // node: loop playRound until game over
        // if over, log responseBody then handleWord()
  }

  filterWords(){
    // parse responseWord via findLettersIdx

    // if currentDictionary same as jsonDictionary, then return out

    // if currentDictionary is empty, return

    // if there's one word and guessed letter that didn't work,
      // reassign currentDictionary = {}

    // itr through currentDictionary to filter
      // if guess difference the same (aka guessed correct letter)
        // filter for words that match responseWord
      // else guessed incorrectly
        // filter OUT words that contain last guessed letter

  }

  findLettersIdx(){
    // returns array of indeces where there are letters
  }

  pickLetter(){
    // figure out if should guess
    // guessDifference =
      // guessesLeftBeforeRequest -   this.responseBody.guessesLeft

    // update guessesLeftBeforeRequest

    // return freqList[guessDifference]
  }

  updateFreqList(){
    // if this.lastGuessedLetter === '' is empty, return

    // if currentDictionary is empty,
      // use Oxford List
      // assign isNewWord = true;

    // find currentDictionary's frequency list
    let lettersCountHash = this.countLetters();
    let frequencyList =
      Object.keys(lettersCountHash).sort(
        (a,b) => lettersCountHash[b] - lettersCountHash[a]);
    
    // filter out lettersGuessed
    this.freqList = frequencyList.filter(
      letter => !(this.lettersGuessed[letter]));
  }

  countLetters(){
    let countHash = {};

    for (var key in this.currentDictionary) {
      if (this.currentDictionary.hasOwnProperty(key)) {
        let word = this.currentDictionary[key];

        for (var i = 0; i < word.length; i++) {
          let letter = word[i];

          // create or add to letter's count
          if (countHash[letter]) {
            countHash[letter]++;
          } else {
            countHash[letter] = 1;
          }
        }
      }
    }

    return countHash;
  }
  /* runtime: O(n * m), where n = num of words in list, m = word length
  space: O(1), always <= obj of length 26 */

  // figures out what to do w/word
  handleWord(){
    // figure out what the word is

    // if isNewWord is false
      // log 'yay this word was in my dictionary!
    // else saveWord(word)
  }

  saveWord(word){
    // uses jsonDictionary and nextWordKey
    // to push word to correct json length dict
  }
}

new Game();
