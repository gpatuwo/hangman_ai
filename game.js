'use strict';

const request = require('request');
const fs = require('fs');

class Game {
  constructor(){
    this.gameId = '';
    this.wordLength = 0;
    this.jsonDictionary = {};
    this.nextWordKey = '';
    this.gameStatus = 'active';
    this.lettersGuessed = {};
    this.guessesLeft = 10;
    this.url = "http://int-sys.usr.space/hangman/games/";

    this.currentDictionary = {};
    this.freqList = [];
    this.responseBody = {};

    this.setupGame();
  }

  setupGame(){
    // fe: remove event listener to guess-button to disable it

    // make post request. in cb:
      // update ivars, incl freqList via makeFreqList();
      // fe: re-enable guess-button
      // node: playRound()
  }

  playRound(){
    // populate currentDictionary via filterWords()
    // figure out what to guess via pickLetter

    // fe: disable guess-button

    // make request. in cb:
      // fe: re-enable guess-button
      // node: loop playRound until game over
  }

  filterWords(){
    // first time:
      // dict = jsonDictionary;

  }

  pickLetter(){
    // if first guess
      // makeFreqList with jsonDictionary
    // else if guessed wrong letter
      // go down freqList
    // else guessed right letter.
      // pick from new freqList
  }

  makeFreqList(){

  }

}

new Game();
