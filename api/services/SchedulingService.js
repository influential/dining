var twitterAPI = require('node-twitter-api');
var async = require('async');
const Pageres = require('pageres');

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
    console.log("hey");
  },
  
  dinner: function() {  
    console.log("hey");
  },
  
  snapshot: function(location, selector) {
    var date = new Date().toISOString().slice(0,10);
    const pageres = new Pageres({delay: 5, selector: selector})
	    .src("dining.iastate.edu/menus/seasons/" + date, ["1024x768"])
	    .dest("../../.tmp/public/")
	    .run()
	    .then(() => console.log("snap"));
  },
  
  tweet: function() {
    var twitter = new twitterAPI({
	    consumerKey: sails.config.oauth.CK,
	    consumerSecret: sails.config.oauth.CKS,
	    callback: 'http://104.131.2.65/twitter'
	  });
	  async.parallel([
      twitter.uploadMedia("", sails.config.oauth.AT, sails.config.oauth.ATS),
      twitter.uploadMedia("", sails.config.oauth.AT, sails.config.oauth.ATS),
      twitter.uploadMedia("", sails.config.oauth.AT, sails.config.oauth.ATS),
      twitter.uploadMedia("", sails.config.oauth.AT, sails.config.oauth.ATS)
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
