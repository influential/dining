var express = require('express');
var app = express();
var router = express.Router();
var controllers = require('/controllers');

app.use(express.static(__dirname + '/public'));

router.get('/auth', controllers.auth);

app.get('/image', function(req, res) {
  res.send('hello world');
});

app.listen(3000);
