/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var CronJob = require('cron').CronJob;

module.exports.bootstrap = function(cb) {
  
  //Breakfast
  
  new CronJob('00 30 06 * * 1-5', function() {
  SchedulingService.breakfast();
  }, null, true, 'America/Chicago');
  
  //Lunch
  
  new CronJob('00 00 10 * * 1-5', function() {
  SchedulingService.lunch();
  }, null, true, 'America/Chicago');
  
  //Dinner
  
  new CronJob('00 00 04 * * 1-5', function() {
  SchedulingService.dinner();
  }, null, true, 'America/Chicago');

  // Callback Trigger
  
  cb();
  
};
