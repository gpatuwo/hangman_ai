# Hangman Solver

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
