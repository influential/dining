var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var meal = system.args[2];
var save = system.args[3];

page.open(url, function(status) {
  if(save == 'seasons') page.render('/root/dining/public/seasons.png');
  if(save == 'conversations') page.render('/root/dining/public/conversations.png');
  if(save == 'udm') page.render('/root/dining/public/udm.png');
  if(save == 'storms') page.render('/root/dining/public/storms.png');
  var top, bottom;
  if(meal == 0) {
    top = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[0].getBoundingClientRect().top;
    });
    bottom = page.evaluate(function() {
      return document.querySelectorAll(".event-header")[1].getBoundingClientRect().top;
    });
  } else if(meal == 1) {
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
      var check = document.querySelectorAll(".event-header").length;
      if(check > 3) return document.querySelectorAll(".event-header")[3].getBoundingClientRect().top;
      else return document.querySelectorAll(".legend")[0].getBoundingClientRect().top;
    });
  }
  console.log(top + "---" + bottom);
  phantom.exit();
});
