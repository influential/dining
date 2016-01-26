/* Node Modules */

var twitterAPI = require('node-twitter-api');
var async = require('async');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var gm = require('gm');
var CronJob = require('cron').CronJob;
var express = require('express');
var keys = require('./local.js');

/* Server Launch and Routes*/

var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000);
app.get('/tweet', function(req, res) { test();/*res.send('Successful Post')*/ });
app.get('/auth', function(req, res) { res.send('Successful Authentication') });
//run();
//test();

function test() {
  menu(0);
}

/* Cron Jobs */

function run() {
  
  //Breakfast
  new CronJob('00 30 06 * * 1-5', function() {
  menu(0);
  }, null, true, 'America/Chicago');
  
  //Lunch
  new CronJob('00 00 10 * * 0-6', function() {
  menu(1);
  }, null, true, 'America/Chicago');
  
  //Dinner
  new CronJob('00 00 04 * * 0-6', function() {
  menu(2);
  }, null, true, 'America/Chicago');
  
}

/* Screenshots/Crops Menu Page */

function screenshot(location, meal) {
  var date = new Date().toISOString().slice(0,10);
  var url = 'http://dining.iastate.edu/menus/' + location + '/' + date;
  var childArgs = ['/root/dining/phantom.js', url, meal];
  console.log(url + "---" + meal);
  childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
  	if(err) console.log(err);
	if(stderr) console.log(stderr);
	console.log(stdout.toString());
	var results = stdout.toString().split("\n");
	console.log(results[0] + "---" + results[1]);
	gm('/root/dining/public/' + location + '.png').crop(1000, parseInt(results[1]) - parseInt(results[0]), 0, parseInt(results[0]))
	.write('/root/dining/public/' + location + '.png', function (err) {
		if(err) console.log(err);
		return 1;
	});
  });
}

/* Menu Logic */

function menu(meal) {
  var day = new Date().getDay();
  if(meal == 0) {
    //async.parallel([
     // screenshot("udcc", 1),
	   // screenshot("seasons", 1),
	    screenshot("conversations", 1);
	  // ], function(err, results) {
	    //tweet();
	   //console.log(results);
	  // });
  } else if(meal == 1) {
    if(day == 0 || day == 6) {
      
    } else {
      
    }
  } else {
    if(day == 0 || day == 6) {
      
    } else {
      
    }
  }
}

/* Tweet Pictures */

function tweet() {
  var twitter = new twitterAPI({
	    consumerKey: keys.oauth.CK,
	    consumerSecret: keys.oauth.CKS,
	    callback: 'http://104.131.2.65/tweet'
	});
	var actions = [
		twitter.uploadMedia("/root/dining/public/udcc.png", keys.oauth.AT, keys.oauth.ATS),
		twitter.uploadMedia("/root/dining/public/seasons.png", keys.oauth.AT, keys.oauth.ATS),
		twitter.uploadMedia("/root/dining/public/conversations.png", keys.oauth.AT, keys.oauth.ATS),
		twitter.uploadMedia("/root/dining/public/storms.png", keys.oauth.AT, keys.oauth.ATS)
  ]
  if(meal == 0) {
    actions = actions.slice(0, 2);
  } else if(meal == 1) {
    
  } else {
    
  }
	async.parallel(actions, function(err, results) {
    		if(err) console.log(err);
    		twitter.statuses("update", {media_ids: results},
    			keys.oauth.AT,
    			keys.oauth.ATS,
    		  function(err, data, response) {
	        	if (error) console.log(err);
	            	return true;
	        	}
      		);
  	});
}
