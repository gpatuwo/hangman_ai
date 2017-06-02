# Hangman Solver

To run this Node.js game, download this repo and run `node game.js` in your terminal. The log will show how the AI is working to guess the hangman word, and also whether or not it is able to guess the word.

Here's an example:
~~~~
<------ starting new game ------>
responseBody: { gameId: 'f164c52b3283', word: '_________', guessesLeft: 10 }
initial freqList: ["e","i","a","r","n","o","t","s","l","c","u","d","m","p","h","g","y","b","f","k","v","w","z","x","j","q"]
<------ starting round ------>
...
<------ guessing another letter ------>
filtering Words
didWrongGuess: false
newlettersIdx: [ 3 ]
<------ filterForWords ------>
updated freqList: ["l","d"]
guessing letter: l
response: { gameId: 'f164c52b3283',
  status: 'active',
  word: 'heral_ize',
  guessesLeft: 8,
  msg: 'You have guessed l' }
<------ guessing another letter ------>
filtering Words
didWrongGuess: false
newlettersIdx: [ 4 ]
<------ filterForWords ------>
updated freqList: ["d"]
guessing letter: d
response: { gameId: 'f164c52b3283',
  status: 'inactive',
  word: 'heraldize',
  guessesLeft: 0,
  msg: 'Congrats! You have solved this hangman!' }
<------ handling word ------>
yay this word was in my dictionary!
~~~~

## How It Works
On a high level, the script makes an API call to get a new hangman word and uses its own dictionary to figure out what letters to guess by constructing letter frequency lists. It gets smarter for next time, by saving new words into its own dictionary.

1. Makes a `POST` request to start a new game
2. Parses the response to figure out what the word length is and looks into its dictionary for that length to create a list of the letters sorted in order of frequency (the `freqList`).
3. Makes a `POST` request to guess the first letter in the `freqList`.
4. Parses the response to then narrow down the dictionary words. If the guess was correct, the dictionary will only contain words that match the response. If not, the AI will get rid of any words that contain that guessed letter.
5. Creates a new `freqList` based on this altered dictionary. (`freqList` doesn't contain any letters that's already been guessed)
6. Repeats steps 3-5 until either it has correctly guessed the word OR the dictionary doesn't contain any words that matches the hangman word.
7. Makes guesses according to the Oxford Dictionary frequency list
8. Saves word into appropriate dictionary

## Implementation
### Letter Guessing Logic
The bulk of the logic of picking which letter to guess lies in these functions:
  - `filterWords()`: looks at the response from the `POST` request to figure out if it should alter the current dictionary hash and if so, then how it the dictionary needs to filtered.

    If the letter that was just guessed is incorrect, then it filters **out** words in the dictionary that contain that letter via `filterOutWords()`.

    If it is correct, then the Solver finds the indexes of where this letter is located on the Hangman word and, via `filterForWords()`, filters **for** words in the dictionary that contain the letter at those indexes.

  - `updateFreqList()`: figures out what the letter frequencies are in the current dictionary. If there are no words in the dictionary, the frequency list is assigned to the Oxford Dictionary's list. Otherwise, it  iterates through the current dictionary to create a hash count of the frequencies of each letter. It then outputs the letters in order from most common to least.

    `updateFreqList()` also filters out any letters in the frequency list that has already been guessed before updating `freqList`

  - `playRound()`: invokes `filterWords` and `updateFreqList` to guess the first letter of the `freqList` via a post request. The callback of this request parses the response to figure out if it should keep playing or not via this conditional:
  ~~~~javascript
  if (data.status === 'inactive') {
    // BREAKS OUT OF FOR LOOP!
    this.handleWord(data);
  } else {
    console.log("<------ guessing another letter ------>");
    this.playRound();
  }
  ~~~~

#### Research

## Future Improvements
- Convert to MongoDB: The Solver currently uses JSON files as a pseudo database. With more time, it would be way better to use MongoDB to store the dictionaries. This would also allow for a fully dynamic frontend that's able to update the database with each new word.
-
