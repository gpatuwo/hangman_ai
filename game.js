// used for front-end logic, need human input to keep guessing

'use strict';

const request = require('request');
const fs = require('fs');

class Game {
  constructor(){
    this.gameId = '';
    this.wordLength = 0;
    this.jsonDictionary = {};
    this.nextWordKey = '';
    this.newWord = false;
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
    // fe: remove event listener to guess-button to disable it

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
      // assign newWord = true;

    // looks at currentDictionary to find arr of letters in order of frequency

    // diff list with lettersGuessed
  }

  // figures out what to do w/word
  handleWord(){
    // figure out what the word is

    // if newWord is false
      // log 'yay this word was in my dictionary!
    // else saveWord(word)
  }

  saveWord(word){
    // uses jsonDictionary and nextWordKey
    // to push word to correct json length dict
  }
}

new Game();
