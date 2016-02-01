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
app.get('/tweet', function(req, res) { res.send(200) });
//app.get('/test', function(req, res) { menu(1) });
//app.get('/login', function(req, res) { authenticate() });
//app.get('/auth', function(req, res) { confirm(req) });
app.listen(3000);
run();

/* Global Twitter Object For Tweeting */

var twitter = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/tweet' });

/* Cron Jobs */

function run() {
    new CronJob('00 30 06 * * 1-5', function() { menu(0) }, null, true, 'America/Chicago');
    new CronJob('00 00 10 * * 0-6', function() { menu(1) }, null, true, 'America/Chicago');
    new CronJob('00 00 16 * * 0-6', function() { menu(2) }, null, true, 'America/Chicago');
}

/* Screenshots/Crops Menu Page and Uploads to Twitter */

function screenshot(location, meal, cb) {
    var date = new Date().toISOString().slice(0,10);
    var url = 'http://dining.iastate.edu/menus/' + location + '/' + date;
    var childArgs = ['/root/dining/phantom.js', url, meal, location];
    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
        var results = stdout.toString().split("---");
        if(results.length < 2) throw new Error("Dining Centers Closed!");
        gm('/root/dining/public/' + location + '.png').crop(1000, parseInt(results[1]) - parseInt(results[0]), 0, parseInt(results[0]))
        .write('/root/dining/public/' + location + '.png', function(err) {
            gm('/root/dining/public/' + location + '-title.png').append('/root/dining/public/' + location + '.png')
            .write('/root/dining/public/' + location + '.png', function(err) {
                twitter.uploadMedia({media: '/root/dining/public/'+ location + '.png'}, keys.oauth.AT, keys.oauth.ATS, cb);
            });
        });
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
            if(err) return error(err);
            var ids = results.map(function(obj) { return obj[0].media_id_string });
            tweet(ids.join(), meal);
        });
    } else if(meal == 1) {
        if(day == 0 || day == 6) lunch = lunch.slice(0,2);
        async.parallel(lunch, function(err, results) {
            if(err) return error(err);
            var ids = results.map(function(obj) { return obj[0].media_id_string });
            tweet(ids.join(), meal);
        });
    } else {
        if(day == 0) dinner = dinner.slice(0,2);
        if(day == 5) dinner = dinner.slice(0,3);
        if(day == 6) dinner = dinner.splice(2, 1);
        async.parallel(dinner, function(err, results) {
            if(err) return error(err);
            var ids = results.map(function(obj) { return obj[0].media_id_string });
            tweet(ids.join(), meal);
        });
    }
}

/* Tweet Pictures */

function tweet(ids, meal) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var day = days[new Date().getDay()];
    var text = " Breakfast";
    if(meal == 1) text = " Lunch";
    if(meal == 2) text = " Dinner";
    twitter.statuses("update", {status: day + text, media_ids: ids}, keys.oauth.AT, keys.oauth.ATS, function(err, data, response) {
        if(err) return error(err);
    });
}

/* Status Notification */

function error(message) {
    console.log("message");
}

/* Oauth Authentication */

function authenticate(res) {
    var twitterAuth = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
    twitterAuth.getRequestToken(function(err, requestToken, requestTokenSecret, results) {
        process.env.RT = requestToken;
        process.env.RTS = requestTokenSecret;
        var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
        res.redirect(url);
    });
}

/* Oauth Confirmation */

function confirm(req) {
    var twitterConfirm = new twitterAPI({ consumerKey: keys.oauth.CK, consumerSecret: keys.oauth.CKS, callback: 'http://104.131.2.65:3000/auth' });
    twitterConfirm.getAccessToken(process.env.RT, process.env.RTS, req.query.oauth_verifier, function(err, accessToken, accessTokenSecret, results) {
        console.log("AccessToken: " + accessToken + "\nAccessTokenSecret: " + accessTokenSecret);
    });
}
