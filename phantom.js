var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var meal = system.args[2];
console.log("args");
page.open(url, function(meal) {
  page.render('/root/dining/public/seasons.png');
  var top = page.evaluate(function() {
    return document.querySelectorAll(".event-header")[meal].getBoundingClientRect().top;
  });
  /*var bottom;
  if(meal == 2) {
    bottom = page.evaluate(function() {
      //return document.querySelectorAll(".event-header")[meal + 1].getBoundingClientRect().top;
    });
  } else {
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[meal + 1].getBoundingClientRect().top;
    });
  }*/
  return top;
  console.log(top + "--")
  phantom.exit();
}, meal);
