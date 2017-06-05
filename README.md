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

### The Dictionary
The dictionary set contained in this app is the result of running a node script to continuously fetch more than 36,500 words by playing the game with the API. Each word is saved into the appropriate word length dictionary file.

This approach was taken because the words from the server range from single letters ('y') to non-english words ('jarra' (spanish)) to family names ('belucki'). Since there's no guarantee that the Hangman word would be a valid English word, using an external dictionary API would not suffice and thus the creation this custom dictionary.

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

### Researching the Approach
Playing Hangman IRL, you know to always start with the letter 'e.' I wanted to know if it was more efficient to guess vowels first or just go down the list of most frequently used letters (and if so, what list to use). To do so, I broke the test down into two sections:
- list testing
  The most commonly referenced letter frequency tables were the [Cornell Math department's table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html) and the [Concise Oxford Dictionary's list](https://en.oxforddictionaries.com/explore/which-letters-are-used-most)

  I ran a test using Postman requests of 10 rounds going straight down the Cornell table and 10 rounds down the Oxford table.
  - Cornell: solved 3/10 words
  - Oxford: solved 7/10 words

  This result makes sense bc the Cornell list analyzed 40,000 words in natural text. The API serving the word only gives one word at a time, so it's more similar to the Oxford list.

  From here, I wrote a Node.js script to continuously guess letters straight down the Oxford list. The result after 400 words:
  ~~~~
  solved: 8 | missed: 9 | total: 17
  solved: 63 | missed: 58 | total: 121
  solved: 95 | missed: 81 | total: 176 | success rate 53.97727272727273
  solved: 46 | missed: 43 | total: 89 | success rate 51.68539325842697
  __________________________________________________________________
  solved: 212 | missed: 191 | total: 403 | success rate 52.6%****

  at roughly 5.4 words/min
  ~~~~
  **** although this data doesn't show it, the percentage actually leveled out to 50% after 1000 words

- vowels testing
  Another strategy to playing Hangman is to guess the vowels first and then the consonants. To do so, I altered the script to guess vowels first until at least half of the response word contained vowels and then guess the consonants. Surprisingly, the results were essentially the same as going straight down the list:

  ~~~~
  solved: 24 | missed: 26 | total: 50 | success rate 48
  solved: 57 | missed: 43 | total: 100 | success rate 56.999
  solved: 77 | missed: 73 | total: 150 | success rate 51.333
  solved: 101 | missed: 99 | total: 200 | success rate 50.5

  at roughly 5.4 words/min
  ~~~~

Tests for custom frequency list:
~~~~
solved: 32 | missed: 18 | total: 50 | success rate 64
solved: 63 | missed: 37 | total: 100 | success rate 63
solved: 96 | missed: 54 | total: 150 | success rate 64
solved: 125 | missed: 75 | total: 200 | success rate 62.5
solved: 159 | missed: 91 | total: 250 | success rate 63.6
solved: 187 | missed: 113 | total: 300 | success rate 62.33333333333333
~~~~

## Future Improvements
- Converting to MongoDB: The Solver currently uses JSON files as a pseudo database. With more time, it would be way better to use MongoDB to store the dictionaries. This would also allow for a fully dynamic frontend that's able to update the database with each new word.
- Working with a linguist: Although not all the words given by the API were valid English words, the words did resemble combinations of valid English words (eg 'unexemptible' --> 'un' 'exempt' 'ible'). Collaboration with a linguist (or any word nerds... ;) would greatly illuminate what prefixes and suffixes are possible and where in the word to find those.
  Alternatively, I could just keep running the script to fetch words until there are no more new words. Already with 36,500+ words, 3100+ of the Hangman words have already been given before. I noticed that the more words the script ran, the rate of seeing more and more of the same words increased exponentially. I suspect that there is a limit to the number of words (or word combinations) the API contains.
