var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/crop', function(req, res) {
  res.send('hello world');
});

app.get('/image', function(req, res) {
  res.send('hello world');
});

app.listen(80);
