/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var twitterAPI = require('node-twitter-api');

module.exports = {
	
	connect: function(req, res) {
		
	var twitter = new twitterAPI({
	    consumerKey: 'ppu9vZOIZMIcA6ZcUflQZHiy7',
	    consumerSecret: 'XvS1jya2OgbFEWmM7bPEDlBhZVw4Pw3IPQ4kXgVj6N0wkIAgWl',
	    callback: 'http://104.131.2.65/twitter'
	});
	if(req.param('oauth_verifier')) {
		console.log("yes");
		twitter.getAccessToken(process.env.RT, process.env.RTS, req.param('oauth_verifier'), function(error, accessToken, accessTokenSecret, results) {
			if (error) {
				console.log(error);
			} else {
				console.log(accessToken);
				console.log(accessTokenSecret);
				console.log(results);
			}
		});
	} else {
		console.log("no");
		twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
			if(error) {
				console.log('Error getting OAuth request token : ' + error);
			} else {
				process.env.RT = requestToken;
				process.env.RTS = requestTokenSecret;
				console.log(requestToken);
				//twitter.getAuthUrl(requestToken);
				var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
				res.redirect(url)
			}
		});
	}
	
	}
	
};

