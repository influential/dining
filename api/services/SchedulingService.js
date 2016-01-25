var twitterAPI = require('node-twitter-api');
var async = require('async');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');

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
		var childArgs = ['/root/dining/phantom.js', location, selector];
		childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
		  // handle results 
		  if(err) console.log(err);
		  if(stdout) console.log(stdout);
		  if(stderr) console.log(stderr);
		});
		
  	    /*'../../.tmp/public/' + location + '.png'
  	    var run = yield nightmare.goto('http://dining.iastate.edu/menus/' + location + '/' + date)
	    .inject('js', 'node_modules/jquery/dist/jquery.js')
	    var date = new Date().toISOString().slice(0,10);
	    var element = $(document).find(selector);
		    var exists = element.length;
		    if(exists > 0) {
		            console.log("ex" + exists);
			    if(!end) end = exists;
			    if(!start) start = 0;
			    var left, right, top, bottom = 0;
			    for(var i = start; i < end; i++) {
			      	if(left > element[i].getBoundingClientRect().left) left = element[i].getBoundingClientRect().left;
			      	if(right < element[i].getBoundingClientRect().right) right = element[i].getBoundingClientRect().right;
			      	if(top > element[i].getBoundingClientRect().top) top = element[i].getBoundingClientRect().top;
			      	if(bottom < element[i].getBoundingClientRect().bottom) bottom = element[i].getBoundingClientRect().bottom;
			    }
			    window.scrollTo(Math.round(left), Math.round(top));
			    console.log(top + "-" + left);
			    return {
			        x: Math.round(left),
			        y: Math.round(top),
			        width: Math.round(right - left),
			        height: Math.round(bottom - top)
			    };
		    }*/
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
