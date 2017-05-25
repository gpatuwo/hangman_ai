var request = require('request');
let url = "http://int-sys.usr.space/hangman/games/";
let formData = {email: 'grace.patuwo@gmail.com'};

// request(url, function (error, response, body) {
//   console.log('error:', error);
//   console.log('statusCode:', response && response.statusCode);
//   console.log('body:', body);
// });

request.post({url: url, formData: {email: 'grace.patuwo@gmail.com'}},
  function cb(error, response, body) {
    if (error) return console.log('error!');

    console.log('body:', body);
  }
);
