var page = require('webpage').create();
/*var system = require('system');
var url = system.args[1];
var meal = system.args[2];*/

page.open(url, function() {
  var top = page.evaluate(function() {
    return document.querySelectorAll(".event-header")[0].getBoundingClientRect().top;
  });
  console.log(top);
  var bottom;
  if(meal == 2) {
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[meal + 1].getBoundingClientRect().top;
    });
  } else {
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[meal + 1].getBoundingClientRect().top;
    });
  }
  console.log(bottom);
  page.render('public/seasons.png');
  phantom.exit();
});
