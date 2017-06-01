# Hangman Solver

## Structure
Server-side

1. dictionary builder script: to fetch a ton of words from API. stored words in txt files

2. json dictionary builder: to convert text files usable a data type for determine initial frequency list for each length dictionary

 - hash dictionary builder: convert json dictionaries into exportable js objects --> cache initial length hash dicts via heroku's [memecache?](https://devcenter.heroku.com/articles/memcachier#node-js)

3. frequency generator:
  - converts json length dictionary into object
  - find/save initial frequency for each length dictionary
  - re-used to gen order of letter guesses as

Front-end
4. letter guesser: handles logic for guessing the next letter
  - gets next letter to guess from freq gen
  - narrows down options from hash dictionary
  - repeats the above 2 until game over (guessed it or not)

5. word saver: saves word into dictionary (smarter next time!)
  - breaks down missed word into chars
  - saves array into corresponding json list
  - updates initial freq count and list

6. ui to visually showcase server-side logic
  - background-image:
    linear-gradient(
      to right,
      #ff9900, #ffcc00
    );
  - red: #ff3333
  - text all in roboto-light
  - add/remove listeners

## Process
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
- obscure: carinaria, kieselguhr
- invalid: vomitingly, unexcusing
- non-english: infern (catalan?), shakti (hindi), jarra (spanish)
- family names: belucki, witneyer

Because of the later 4 categories, it won't be extremely helpful to use [di or multigraph frequency tables](https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/digraphs.html) (eg th, er, tion) to complete words nor would sourcing guesses from an external dictionary API.



### Kaizen / Dictionary Builder
Kaizen is a Japanese word that roughly translates to "continuous improvement." Because there's no clear pattern of words the API can send out, let's teach the AI solver to eventually
  - build own (via trie?) after game starts
    - especially helpful if server only choses from limited amount of words

after script was built, ran straight down oxford list
solved: 8 | missed: 9 | total: 17
solved: 63 | missed: 58 | total: 121
(--solved: 54 | missed: 46 | total: 100 | success rate 54--)
solved: 95 | missed: 81 | total: 176 | success rate 53.97727272727273
solved: 46 | missed: 43 | total: 89 | success rate 51.68539325842697
__________________________________________________________________
solved: 212 | missed: 191 | total: 403 | success rate 52.6%

~ 54-51% success at roughly 5.4 words/min

would guessing the vowels first increase rate of success and/or run time?
- expect success rate to be higher
- extra loop ( O(wordlength) time) involved, but is higher success rate able to speed it up or at least be the same?

(--solved: 24 | missed: 26 | total: 50 | success rate 48
(--solved: 57 | missed: 43 | total: 100 | success rate 56.99999999999999
(--solved: 77 | missed: 73 | total: 150 | success rate 51.33333333333333
solved: 101 | missed: 99 | total: 200 | success rate 50.5
at roughly 5.4 words/min

- make own frequency table???
  - for this dictionary set
  - for each length list
  - for letter position
- server-side js logic
- split is a linear operation on the thing that we're splitting. but we know what's gonna come back so it's dependent on the length of the word

freq-gen sequence:
- word comes in, # of letters
  - pre-gen freq list for length lists?
- guess first letter (probs e)
- parse response
  - if yes,
    - itr thru word, find position of letter/s
    - narrow down words list to matches
    - freq gen that list to guess next letter
  - if no,
    - then guess 2nd length list letter


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
- script would stop when it got freakishly long words that exceeded the letter-count lists provided
- freq list generator had an 'undefined' in output array list
  - json builder script got REAL WEIRD when got past 9 letters
  - issue: when tried to loop json dict builder
  - solution: disregarded loop and just manually inputed word length
