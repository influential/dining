var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var selector = system.args[2];

page.open(url, function(status) {
  if (status !== 'success') {
    console.log('Failed to load the address');
  } else {
    page.render('assets/images/seasons.png');
  var top = page.evaluate(function() {
    return document.querySelectorAll(".event-header")[1].getBoundingClientRect().top;
  });
  console.log(top);
  var bottom = page.evaluate(function() {
    return document.querySelectorAll(".event-header")[2].getBoundingClientRect().top;
  });
  console.log(bottom);
  }
  phantom.exit();
});
