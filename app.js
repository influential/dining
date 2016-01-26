var express = require('express');
var app = express();

app.get('/crop', function(req, res) {
  res.send('hello world');
});

app.get('/image', function(req, res) {
  res.send('hello world');
});

app.listen(8080, function () {
  console.log('Listening');
});
