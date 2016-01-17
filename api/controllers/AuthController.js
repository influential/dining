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
	    callback: 'http://104.131.2.65/'
	});
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
		if(error) {
			console.log('Error getting OAuth request token : ' + error);
		} else {
			console.log(requestToken);
			console.log(requestTokenSecret);
			console.log(results);
		}
	});
	
	}
	
};

