# Hangman Solver

- derive set of rules for guessing the letters/word
  - letter frequency
    - assign each letter a weight
    - initialize alphabet array in order of frequency (eg start with e...q)
- dictionary
  - external api
  - build own (via trie?) after game starts
    - especially helpful if server only choses from limited amount of words
