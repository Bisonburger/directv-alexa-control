// Start up the server
var express = require('express');
var alexa = require('alexa-app');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.port || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function() {
  console.log("Server listening at " + process.env.IP + " : " + process.env.PORT);
});
