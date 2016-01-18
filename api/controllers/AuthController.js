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
	    consumerKey: process.env.OAUTH_CK,
	    consumerSecret: process.env.OAUTH_CKS,
	    callback: 'http://104.131.2.65/twitter'
	});
	console.log(process.env.OAUTH_CK);
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
				var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
				res.redirect(url);
			}
		});
	}
	
	}
	
};

