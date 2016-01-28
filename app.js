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
app.get('/tweet', function(req, res) { menu(1) /* res.send(200) */ });
app.get('/twitter', function(req, res) { authenticate() });
app.get('/auth', function(req, res) { confirm(req) });

//run();

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

function screenshot(location, meal, cb) {
    var date = new Date().toISOString().slice(0,10);
    var url = 'http://dining.iastate.edu/menus/' + location + '/' + date;
    var childArgs = ['/root/dining/phantom.js', url, meal, location];
    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
        var results = stdout.toString().split("---");
        gm('/root/dining/public/' + location + '.png').crop(1000, parseInt(results[1]) - parseInt(results[0]), 0, parseInt(results[0]))
        .write('/root/dining/public/' + location + '.png', function (err) { 
            if(err) console.log(err);
            cb();
        });
    });
}

/* Adjoin Screenshots */

function join(cb) {
	async.parallel([
            gm('/root/dining/public/seasons-title.png').append('/root/dining/public/seasons.png').write('/root/dining/public/seasons.png', cb());,
            function(cb) { joiner("conversations", cb) },
            function(cb) { joiner("storms", cb) },
            function(cb) { joiner("udm", cb) }
        ], function(err, results) {
           console.log("append");
           cb();
        });
}

/* Join Helper */

function joiner(location, cb) {
	gm('/root/dining/public/' + location + '-title.png').append('/root/dining/public/' + location + '.png')
    .write('/root/dining/public/' + location + '.png', function (err) { 
		if(err) console.log(err);
		cb();
	});
}

/* Menu Logic */

function menu(meal) {
    var day = new Date().getDay();
    if(meal == 0) {
        async.parallel([
            function(cb) { screenshot("udm", 0, cb) },
        	function(cb) { screenshot("seasons", 0, cb) },
        	function(cb) { screenshot("conversations", 0, cb) }
        ], function(err, results) {
        	console.log("screenshots")
        	async.series([
			    function(cb){ join(cb) },
			    function(cb){ tweet(cb) }
			], function(err, results){
			    console.log("all done");
			});
        });
    } else if(meal == 1) {
    	if(day == 0 || day == 6) {
            async.parallel([
                function(cb) { screenshot("udm", 1, cb) },
                function(cb) { screenshot("seasons", 1, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        } else {
            async.parallel([
                function(cb) { screenshot("udm", 1, cb) },
                function(cb) { screenshot("seasons", 1, cb) },
                function(cb) { screenshot("conversations", 1, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        }
    } else {
        if(day == 0) {
            async.parallel([
                function(cb) { screenshot("udm", 2, cb) },
                function(cb) { screenshot("seasons", 2, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        } else if(day == 5) {
            async.parallel([
                function(cb) { screenshot("udm", 2, cb) },
                function(cb) { screenshot("seasons", 2, cb) },
                function(cb) { screenshot("conversations", 2, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        } else if(day == 6) {
            async.parallel([
                function(cb) { screenshot("udm", 2, cb) },
                function(cb) { screenshot("seasons", 2, cb) },
                function(cb) { screenshot("storms", 2, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        } else {
            async.parallel([
                function(cb) { screenshot("udm", 2, cb) },
                function(cb) { screenshot("seasons", 2, cb) },
                function(cb) { screenshot("conversations", 2, cb) },
                function(cb) { screenshot("storms", 2, cb) }
            ], function(err, results) {
                //tweet();
               console.log("done");
            });
        }
    }
}

/* Tweet Pictures */

function tweet(cb) {
    var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/tweet' });
	var actions;
	async.parallel([
    		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/udm.png'}, keys.oauth.AT, keys.oauth.ATS, cb) },
    		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/storms.png'}, keys.oauth.AT, keys.oauth.ATS, cb) },
    		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/conversations.png'}, keys.oauth.AT, keys.oauth.ATS, cb) },
    		function(cb) { return twitter.uploadMedia({media: '/root/dining/public/storms.png'}, keys.oauth.AT, keys.oauth.ATS, cb) }
        ], function(err, results) {
    		var ids = results.map(function(obj) { return obj[0].media_id });
    		console.log(ids);
    		twitter.statuses("update", {media_ids: ids}, keys.oauth.AT, keys.oauth.ATS, function(err, data, response) {
		        	if (err) console.log(err);
		        	console.log("tweeted");
		            cb();
	        });
  	});
}

/* Oauth Authentication */

function authenticate(res) {
	var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
		process.env.RT = requestToken;
		process.env.RTS = requestTokenSecret;
		var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
		res.redirect(url);
	});
}

/* Oauth Confirmation */

function confirm(req) {
	var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
	twitter.getAccessToken(process.env.RT, process.env.RTS, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
		console.log("AccessToken: " + accessToken + "\nAccessTokenSecret: " + accessTokenSecret);
	});
}
