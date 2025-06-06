const cron = require('node-cron');
const fs = require('fs');

function logHello(source) {
  const message = `Hello World from ${source} at ${new Date().toLocaleString()}\n`;
  fs.appendFileSync('job-log.txt', message);
  console.log(message.trim());
}

function scheduleEveryFifteenMinutes() {
  const cronExp = '*/15 * * * *';
  cron.schedule(cronExp, () => logHello('Every 15 Minutes Job'));
}

function scheduleHourlyJob(minute) {
  const cronExp = `${minute} * * * *`;
  cron.schedule(cronExp, () => logHello(`Hourly Job at minute ${minute}`));
}

function scheduleDailyJob(time) {
  const [hour, minute] = time.split(':');
  const cronExp = `${minute} ${hour} * * *`;
  cron.schedule(cronExp, () => logHello(`Daily Job at ${time}`));
}

module.exports = {
  scheduleEveryFifteenMinutes,
  scheduleHourlyJob,
  scheduleDailyJob,
};
