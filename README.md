# Hangman Solver

To run this Node.js game, download this repo and run `node game.js` in your terminal. The log will show how the AI is working to guess the hangman word, and also whether or not it is able to guess the word.

### How It Works
On a high level, the script makes an API call to get a new hangman word and uses its own dictionary to figure out what letters to guess by constructing letter frequency lists. It gets smarter for next time, by saving new words into its own dictionary.

1. Makes a `POST` request to start a new game
2. Parses the response to figure out what the word length is and looks into its dictionary for that length to create a list of the letters sorted in order of frequency (the `freqList`).
3. Makes a `POST` request to guess the first letter in the `freqList`.
4. Parses the response to then narrow down the dictionary words. If the guess was correct, the dictionary will only contain words that match the response. If not, the AI will get rid of any words that contain that guessed letter.
5. Creates a new `freqList` based on this altered dictionary. (`freqList` doesn't contain any letters that's already been guessed)
6. Repeats steps 3-5 until either it has correctly guessed the word OR the dictionary doesn't contain any words that matches the hangman word.
7. Makes guesses according to the Oxford Dictionary frequency list
8. Saves word into appropriate dictionary

### Implementation
#### Letter Guessing Logic

### Future Improvements
- Convert to MongoDB: The Solver currently uses JSON files as a pseudo database. With more time, it would be way better to use MongoDB to store the dictionaries. This would also allow for a fully dynamic frontend that's able to update the database with each new word.
-
