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
app.get('/test', function(req, res) { menu(0) });
app.get('/tweet', function(req, res) { res.send(200) });
app.get('/twitter', function(req, res) { authenticate() });
app.get('/auth', function(req, res) { confirm(req) });
//run();

/* Cron Jobs */

function run() {
    new CronJob('00 30 06 * * 1-5', function() { menu(0) }, null, true, 'America/Chicago');
    new CronJob('00 00 10 * * 0-6', function() { menu(1) }, null, true, 'America/Chicago');
    new CronJob('00 00 04 * * 0-6', function() { menu(2) }, null, true, 'America/Chicago');
}

/* Screenshots/Crops Menu Page */

function screenshot(location, meal, cb) {
    var date = new Date().toISOString().slice(0,10);
    var url = 'http://dining.iastate.edu/menus/' + location + '/' + date;
    var childArgs = ['/root/dining/phantom.js', url, meal, location];
    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
    	if(err) notify(false);//return screenshot(location, meal, cb);
        save(stdout.toString().split("---"), location, cb);
    });
}

function save(results, location, cb) {
	gm('/root/dining/public/' + location + '.png').crop(1000, parseInt(results[1]) - parseInt(results[0]), 0, parseInt(results[0]))
    .write('/root/dining/public/' + location + '.png', function(err) {
   		if(err) notify(false);//return save(results, location, cb);
   		cb();
    });
}

/* Adjoin Screenshots */

function join() {
	async.parallel([
        function(cb) { gm('/root/dining/public/udm-title.png').append('/root/dining/public/udm.png').write('/root/dining/public/udm.png', cb) },
        function(cb) { gm('/root/dining/public/seasons-title.png').append('/root/dining/public/seasons.png').write('/root/dining/public/seasons.png', cb) },
        function(cb) { gm('/root/dining/public/conversations-title.png').append('/root/dining/public/conversations.png').write('/root/dining/public/conversations.png', cb) },
        function(cb) { gm('/root/dining/public/storms-title.png').append('/root/dining/public/storms.png').write('/root/dining/public/storms.png', cb) },
    ], function(err) {
    	if(err) notify(false);//return join();
    	post();
    });
}

/* Menu Logic */

function menu(meal) {
    var day = new Date().getDay();
    var breakfast = [
        function(cb) { screenshot("udm", 0, cb) },
    	function(cb) { screenshot("seasons", 0, cb) },
    	function(cb) { screenshot("conversations", 0, cb) }
    ];
    var lunch = [
        function(cb) { screenshot("udm", 1, cb) },
    	function(cb) { screenshot("seasons", 1, cb) },
    	function(cb) { screenshot("conversations", 1, cb) }
    ];
    var dinner = [
        function(cb) { screenshot("udm", 2, cb) },
    	function(cb) { screenshot("seasons", 2, cb) },
    	function(cb) { screenshot("conversations", 2, cb) },
    	function(cb) { screenshot("storms", 2, cb) }
    ];
    if(meal == 0) {
        async.parallel(breakfast, function(err, results) {
        	join();
        });
    } else if(meal == 1) {
    	if(day == 0 || day == 6) lunch = lunch.slice(0,2);
        async.parallel(lunch, function(err, results) {
        	join();
        });
    } else {
        if(day == 0) dinner = dinner.slice(0,2);
		else if(day == 5) dinner = dinner.slice(0,3);
        else if(day == 6) dinner = dinner.splice(2, 1);
        async.parallel(dinner, function(err, results) {
        	join();
        });
    }
}

/* Upload Pictures */

function post() {
    var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/tweet' });
	async.parallel([
		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/udm.png'}, keys.oauth.AT, keys.oauth.ATS, cb) },
		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/storms.png'}, keys.oauth.AT, keys.oauth.ATS, cb) },
		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/conversations.png'}, keys.oauth.AT, keys.oauth.ATS, cb) }
		//function(cb) { return twitter.uploadMedia({media: '/root/dining/public/storms.png'}, keys.oauth.AT, keys.oauth.ATS, cb) }
    ], function(err, results) {
    	if(err) notify(false);//return post();
    	console.log()
		var ids = results.map(function(obj) { return obj[0].media_id + "" });
		tweet(twitter, ids);
  	});
}

/* Tweet Pictures */

function tweet(twitter, ids) {
	console.log(ids);
	twitter.statuses("update", {media_ids: ids}, keys.oauth.AT, keys.oauth.ATS, function(err, data, response) {
		if(err) console.log(err);//return tweet(ids);
    	notify(true);
    });
}

/* Oauth Authentication */

function authenticate(res) {
	var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
	twitter.getRequestToken(function(err, requestToken, requestTokenSecret, results) {
		if(err) console.log(err);
		process.env.RT = requestToken;
		process.env.RTS = requestTokenSecret;
		var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
		res.redirect(url);
	});
}

/* Oauth Confirmation */

function confirm(req) {
	var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
	twitter.getAccessToken(process.env.RT, process.env.RTS, req.query.oauth_verifier, function(err, accessToken, accessTokenSecret, results) {
		if(err) console.log(err);
		console.log("AccessToken: " + accessToken + "\nAccessTokenSecret: " + accessTokenSecret);
	});
}

/* Status Notification */

function notify(success) {
	if(success) console.log("notify");
	else console.log("fail");
}
