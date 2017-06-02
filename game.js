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
    this.firstGuess = true;

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
      this.responseWord = data.word;
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

      console.log("<------ starting round ------>");
      this.playRound();
    });
  }

  playRound(){

    // populate/reassign currentDictionary via filterWords(responseWord)
    this.filterWords();

    // updateFreqList
    this.updateFreqList();
    console.log('updated freqList:', JSON.stringify(this.freqList));

    this.firstGuess = false;

    // last letter guessed = freqList[0];
    this.lastGuessedLetter = this.freqList[0];
    this.lettersGuessed[this.lastGuessedLetter] = true;
    console.log('guessing letter:', this.lastGuessedLetter);

    let that = this;

    request.post({url: this.url, formData: {char: this.lastGuessedLetter}},
      that.guessLetterCallback.bind(that));
  }

  guessLetterCallback(error, response, body) {
    let data = JSON.parse(body);
    if (data.error) console.log('guessing error:', data.error);

    console.log('response:', data);

    this.responseBody = data;
    this.responseWord = data.word;

    if (data.status === 'inactive') {
      // BREAKS OUT OF FOR LOOP! :D
      this.handleWord(data);
    } else {
      console.log("<------ guessing another letter ------>");
      this.playRound();
    }
  }

  filterWords(){
    let dictionaryLength = Object.keys(this.currentDictionary).length;

    let didWrongGuess = this.didWrongGuess();
    this.guessesLeftBeforeRequest = this.responseBody.guessesLeft;

    // if it's the first guess
    if (this.firstGuess) {
      console.log('first guess');
      return;
    }


    // if no words in dict match
    if (dictionaryLength === 0) {
      console.log('no words in dict match');
      return;
    }

    // if there's one word and guessed a letter that didn't work,
    if (dictionaryLength === 1 && didWrongGuess) {
      console.log("if there's one word and guessed a letter that didn't work");
      this.currentDictionary = {};
      return;
    }

    console.log('filtering Words');
    console.log('didWrongGuess:', didWrongGuess);

    if (didWrongGuess) {
      this.filterOutWords();
    } else {
      let newlettersIdx = this.findNewLettersIdx();
      console.log('newlettersIdx:', newlettersIdx);
      this.filterForWords(newlettersIdx);
    }
  }

  // GET RID of words that do have lastGuessedLetter
  filterOutWords(){
    console.log("<------ filterOutWords ------>");
    let filteredWords = {};

    for (var key in this.currentDictionary){
      if (this.currentDictionary.hasOwnProperty(key)) {
        let word = this.currentDictionary[key];

        // save word if does not have lastGuessedLetter
        if (word.indexOf(this.lastGuessedLetter) === -1) {
          filteredWords[key] = word;
        }
      }
    }

    this.currentDictionary = filteredWords;
  }

  // KEEP words that do have lastGuessedLetter in newlettersIdx
  filterForWords(newlettersIdx){
    console.log("<------ filterForWords ------>");
    let filteredWords = {};

    for (var key in this.currentDictionary) {
      if (this.currentDictionary.hasOwnProperty(key)) {
        let word = this.currentDictionary[key];


        let shouldInsertWord = false;

        for (var i = 0; i < newlettersIdx.length; i++) {
          let idx = newlettersIdx[i];
          let letter = word[idx];

          if (letter === this.lastGuessedLetter) {
            shouldInsertWord = true;
          } else if (letter !== this.lastGuessedLetter &&
            i === newlettersIdx.length - 1) {
            shouldInsertWord = false;
          } else {
            shouldInsertWord = false;
            // skip to next word;
            break;
          }
        }

        // here means went thru word and all letters match
        if (shouldInsertWord === true) {
          filteredWords[key] = word;}
      }
    }

    this.currentDictionary = filteredWords;
  }

  didWrongGuess(){
    return this.guessesLeftBeforeRequest > this.responseBody.guessesLeft;
  }

  findNewLettersIdx(){
    let lettersIdx = [];

    for (let i = 0; i < this.wordLength; i++){
      let letter = this.responseWord[i];

      if (letter === this.lastGuessedLetter) lettersIdx.push(i);
    }

    return lettersIdx;
  }


  updateFreqList(){
    let frequencyList;
    let dictionaryLength = Object.keys(this.currentDictionary).length;

    if (dictionaryLength === 0) {
      this.isNewWord = true;
      frequencyList = [ 'e', 'a', 'r', 'i', 'o', 't', 'n',
       's', 'l', 'c', 'u', 'd', 'p', 'm', 'h', 'g', 'b',
        'f', 'y', 'w', 'k', 'v', 'x', 'z', 'j', 'q' ];
    } else {
      let lettersCountHash = this.countLetters();
      frequencyList =
        Object.keys(lettersCountHash).sort(
          (a,b) => lettersCountHash[b] - lettersCountHash[a]);
    }

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
  handleWord(data){
    console.log("<------ handling word ------>");

    // figure out what the word is
    let firstMsgWord = data.msg.split(" ").shift();
    let lastMsgWord = data.msg.split(" ").pop();

    let word = firstMsgWord === 'Congrats!' ?
      data.word : lastMsgWord;

    if (this.isNewWord) {
      console.log('this is a new word!!!');
      this.saveWord(word);
    } else {
      console.log('yay this word was in my dictionary!');
    }
  }

  saveWord(word){
    // uses jsonDictionary and nextWordKey
    // to push word to correct json length dict
    let path = `./dictionary-json/${this.wordLength}-letter.json`;

    let wordArr = word.split('');

    this.jsonDictionary[this.nextWordKey] = wordArr;

    let newDict = this.jsonDictionary;

    fs.writeFile(path, JSON.stringify(newDict),
      (err) => {
        if (err) return console.log(err);

        console.log(`${word} has been added to ${path}`);
      });
  }
}

new Game();
