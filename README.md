# Hangman Solver
-----
This AI hangman solver is based on the assumption that the API only provides *valid english* words.

-----

As someone who has played Hangman since first grade, I've always known to start with the letter 'e'. Memories of past games inspired me to look into letter frequencies. In my research of this topic, several tables were frequently referenced:
- [Cornell Math department's table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html) that's based on analysis of 40,000 words
- [Concise Oxford Dictionary's list](https://en.oxforddictionaries.com/explore/which-letters-are-used-most) that's based on all the words in the dictionary's 11th edition (2004)
- [Cornell's diagraph frequency table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/digraphs.html)

Curious which frequency table is more efficient for the scope of this game, I ran a test using Postman requests of 10 rounds going straight down the Cornell table and 10 rounds down the Oxford table.
- Cornell: solved 3/10 words
- Oxford: solved 7/10 words

- derive set of rules for guessing the letters/word
  - letter frequency
    - assign each letter a weight
    - initialize alphabet array in order of frequency (eg start with e...q)
    - [Cornell Math Frequency Table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html)
  - letter associations
    - ex: th, tion, sion, qu, er, kn, etc
    - [Cornell's diagraph frequency table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/digraphs.html)
- dictionary
  - external api
  - build own (via trie?) after game starts
    - especially helpful if server only choses from limited amount of words

## Sequence
### Post request to fetch new word
- receive JSON
ex:
`{
  "gameId": "af630b9fb5e7",
  "word": "_________",
  "guessesLeft": 10
}`

### Parse response
- save gameId
- word length

### Post request to guess letter e

### <-- loop until guessesLeft === 0 --> ###
### Parse response
- check status, active vs inactive
- if active...
  - update word (if at all)

### Guess next letter
- if e successful, go down freq list
- if not, guess next freq vowel

### <-- end loop --> ###
