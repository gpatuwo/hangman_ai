# Hangman Solver

### Letter Frequency
As someone who has played Hangman since first grade, I've always known to start with the letter 'e'. Memories of past games inspired me to look into letter frequencies. In my research of this topic, several tables were frequently referenced:
- [Cornell Math department's table](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html) that's based on analysis of 40,000 words
- [Concise Oxford Dictionary's list](https://en.oxforddictionaries.com/explore/which-letters-are-used-most) that's based on all the words in the dictionary's 11th edition (2004)

Curious which frequency table is more efficient for the scope of this game, I ran a test using Postman requests of 10 rounds going straight down the Cornell table and 10 rounds down the Oxford table.
- Cornell: solved 3/10 words
- Oxford: solved 7/10 words

These results make sense. Although there isn't much documentation associated with the Cornell list, I think it's fair to assume that its analysis used 40,000 words in *natural text* since its ordering of letters is different to that of the Oxford table, which disregards word frequency of natural text and uses words straight from the dictionary. Because the API appears to randomly select a word, the Oxford table is a better fit for this game.

From this experiment, it appears that the API feeds from a wide range of words, from  
- normal: tenant, hospital
- obscure: carinaria, oncometric
- invalid: vomitingly, unexcusing
- non-english: infern (catalan?), shakti (hindi)
- family names: belucki, witneyer

Because of the later 4 categories, it won't be extremely helpful to use [di or multigraph frequency tables](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/digraphs.html) (eg th, er, tion) to complete words nor would sourcing guesses from an external dictionary API.



### Kaizen / Dictionary Builder
Kaizen is a Japanese word that roughly translates to "continuous improvement." Because there's no clear pattern of words the API can send out, let's teach the AI solver to eventually
  - build own (via trie?) after game starts
    - especially helpful if server only choses from limited amount of words

after script was built, ran straight down oxford list
solved: 8 | missed: 9 | total: 17
solved: 63 | missed: 58 | total: 121
--solved: 54 | missed: 46 | total: 100 | success rate 54--
solved: 95 | missed: 81 | total: 176 | success rate 53.97727272727273

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

## Errors
- request form data invalid bc of async callbacks
  - looping each request right after each other
  - running the dictionary builder script
    - bc letters were originally shifted out, array was mutated for the next run of the script
    - fixed it so
- setInterval delay
  - tested run time by recording start time and end time, most were under 7000 milliseconds
  - played around with making less delay time but when time was 7000, a slower run would continue and then get chopped out (ie start feedLetters again but gameId would be the same and then in the middle of that run, it would change gameId and thus the word)
