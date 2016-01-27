var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var meal = system.args[2];
var location = system.args[3];

page.open(url, function(status) {
  /*if(location == 'seasons') page.render('public/seasons.png');
  if(location == 'conversations') page.render('public/conversations.png');
  if(location == 'udcc') page.render('public/udcc.png');
  if(location == 'storms') page.render('public/storms.png');*/
  console.log(meal + location);
  var top, bottom;
  if(meal == 1) {
    top = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[0].getBoundingClientRect().top;
    });
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[1].getBoundingClientRect().top;
    });
  } else if(meal == 2) {
    top = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[1].getBoundingClientRect().top;
    });
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[2].getBoundingClientRect().top;
    });
  } else {
    top = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[2].getBoundingClientRect().top;
    });
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[3].getBoundingClientRect().top;
    });
  }
  console.log(top + "---" + bottom);
  phantom.exit();
});
