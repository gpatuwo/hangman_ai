module.exports = function handleWord(msg, word){
  console.log("<------ starting handleWord ------>");
  let firstMsgWord = msg.split(" ").shift();
  let lastMsgWord = msg.split(" ").pop();

  let wordToSave;

  if (firstMsgWord === 'Congrats!') {
    wordToSave = word;
  } else {
    wordToSave = lastMsgWord;
  }
  console.log("FOUND WORD:", wordToSave);

  // saveWord(word);
};

function saveWord(word){

}
