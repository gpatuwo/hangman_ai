'use strict';

// const request = require('request');

class Game {
  constructor(){
    this.gameId = '';
    this.wordLength = 0;
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
  }

  setupGame(){
    let email = 'hangman@gmail.com',
        that = this,
        xmlRequest = new XMLHttpRequest(),
        formData = new FormData();

    formData.append("email", "hangman@gmail.com");

    xmlRequest.open("POST", this.url, true);

    xmlRequest.onreadystatechange = () => {
      if (xmlRequest.status === 201 &&
        xmlRequest.readyState === XMLHttpRequest.DONE) {
        this.requestWordResponse.bind(that)(xmlRequest);
      } else if (xmlRequest.readyState === XMLHttpRequest.DONE
        && xmlRequest.status !== 201){
        console.log("oops xml request failed:", xmlRequest.response);
      }
    };

    xmlRequest.send(formData);
  }

  requestWordResponse(xmlRequest){
    let data = JSON.parse(xmlRequest.response);
    this.responseBody = data;
    this.responseWord = data.word;
    this.gameId = data.gameId;
    this.wordLength = data.word.length;

    // render responseWord
    this.renderResponseWord();
    this.renderGuessesNum();

    // load json file
    // let head = document.getElementsByTagName('head');
    // let jsonScript = "<script type='text/javascript' src='/dictionary-json/";
    // jsonScript += `${this.wordLength}-letter.json'></script>`;
    //
    // head.appendChild(jsonScript);

    this.currentDictionary = jsonDict; 
    console.log(this.currentDictionary);

    this.updateFreqList();
    // render freq list

    // this.url += `${this.gameId}/guesses`;

    // enable even listener for A key
  }

  renderResponseWord(){

    let liSection = this.responseWord.split('').map( letter => {
      return `<li>${letter}</li>`;
    }).join('');

    document.getElementById('response-word').innerHTML = liSection;
  }

  renderGuessesNum(){
    document.getElementById('guesses-num').innerHTML =
     this.responseBody.guessesLeft;
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

    if (dictionaryLength <= 5) {
      console.log('dict before filtering:', this.currentDictionary);
    } else {
      console.log('dict length before filtering:', dictionaryLength);
    }
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

    const OxfordList = [ 'e', 'a', 'r', 'i', 'o', 't', 'n', 's', 'l', 'c',
     'u', 'd', 'p', 'm', 'h', 'g', 'b', 'f', 'y', 'w', 'k', 'v', 'x', 'z',
      'j', 'q' ];

    if (dictionaryLength === 0) {
      this.isNewWord = true;
      frequencyList = OxfordList;
    } else {
      let lettersCountHash = this.countLetters();
      frequencyList =
        Object.keys(lettersCountHash).sort(
          (a,b) => lettersCountHash[b] - lettersCountHash[a]);
    }

    // filter out lettersGuessed
     frequencyList = frequencyList.filter(
      letter => !(this.lettersGuessed[letter]));

    if (frequencyList.length !== 0) {
      this.freqList = frequencyList;
    } else {
      this.freqList = OxfordList.filter(letter =>
         !(this.lettersGuessed[letter]));
    }
    /* this conditional exists at the trade-off of not having to iterate
     through ALL the letters of a dictionary word in the filter */

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


  // figures out what to do w/word
  handleWord(data){
    console.log("<------ handling word ------>");

    // figure out what the word is
    let firstMsgWord = data.msg.split(" ").shift();
    let lastMsgWord = data.msg.split(" ").pop();

    let word = firstMsgWord === 'Congrats!' ?
      data.word : lastMsgWord;

    if (this.isNewWord) {
      console.log('save into dictionary');
    } else {
      console.log('yay this word was in my dictionary!');
    }
  }
}

// module.exports = Game;
