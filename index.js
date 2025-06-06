const { scheduleEveryFifteenMinutes, scheduleHourlyJob, scheduleDailyJob } = require('./scheduler');

// Run test jobs
scheduleEveryFifteenMinutes();     //at every 15 min
scheduleHourlyJob(30);             // At 30th minute 
scheduleDailyJob('14:00');         // Daily at 2:00 PM
