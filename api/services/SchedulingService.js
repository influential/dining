var twitterAPI = require('node-twitter-api');
var async = require('async');
var Nightmare = require('nightmare');
var vo = require('vo');

module.exports =  {
  
	breakfast: function() {  
	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell")
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	lunch: function() {  
	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell"),
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	dinner: function() {  
    	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell"),
	    	SchedulingService.snapshot("storms", ".menu-cell")
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	snapshot: function(location, selector) {
  	    
  	    console.log("2");
  	    vo(function* () {
		  var nightmare = Nightmare({ show: true });
		  var link = yield nightmare
		    .goto('http://yahoo.com')
		    .type('input[title="Search"]', 'github nightmare')
		    .click('.searchsubmit')
		    .wait('.ac-21th')
		    .evaluate(function () {
		      return document.getElementsByClassName('ac-21th')[0].href;
		    });
		  yield nightmare.end();
		  return link;
		})(function (err, result) {
		  if (err) return console.log(err);
		  console.log(result);
		});
	},
  
	tweet: function() {
    		var twitter = new twitterAPI({
		    consumerKey: sails.config.oauth.CK,
		    consumerSecret: sails.config.oauth.CKS,
		    callback: 'http://104.131.2.65/twitter'
		});
		async.parallel([
			twitter.uploadMedia("../../.tmp/public/udcc.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/seasons.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/conversations.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/storms.png", sails.config.oauth.AT, sails.config.oauth.ATS)
    		], function(err, results) {
	    		if(err) console.log(err);
	    		twitter.statuses("update", {media_ids: results},
	    			sails.config.oauth.AT,
	    			sails.config.oauth.ATS,
	    		function(err, data, response) {
		        	if (error) console.log(err);
		            	return true;
		        	}
	      		);
    	});
    
	}
  
};
