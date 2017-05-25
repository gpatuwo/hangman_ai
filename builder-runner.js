var startGame = require('./dictionary-builder.js');

var letters = [ 'e', 'a', 'r', 'i', 'o', 't', 'n',
 's', 'l', 'c', 'u', 'd', 'p', 'm', 'h', 'g', 'b',
  'f', 'y', 'w', 'k', 'v', 'x', 'z', 'j', 'q' ];

setInterval(startGame, 10000, letters);
