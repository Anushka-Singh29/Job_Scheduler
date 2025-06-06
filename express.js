const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { scheduleEveryFifteenMinutes, scheduleHourlyJob, scheduleDailyJob } = require('./scheduler');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Job Scheduler</title>
      <style>
        body {
          background-color: #121212;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        h1 {
          margin-bottom: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 18px;
          background-color: #1f1f1f;
          color: white;
          border: 2px solid #444;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #2c2c2c;
        }
      </style>
    </head>
    <body>
      <h1>Job Scheduler API</h1>
      <button onclick="location.href='/logs'">View Logs</button>
    </body>
    </html>
  `);
});

app.post('/schedule/every-15-minutes', (req, res) => {
  scheduleEveryFifteenMinutes();
  res.send('Scheduled job to run every 15 minutes.');
});

app.post('/schedule/hourly', (req, res) => {
  const { minute } = req.body;
  if (minute >= 0 && minute <= 59) {
    scheduleHourlyJob(minute);
    res.send(`Scheduled hourly job at minute ${minute}`);
  } else {
    res.status(400).send('Invalid minute. Must be between 0 and 59.');
  }
});

app.post('/schedule/daily', (req, res) => {
  const { time } = req.body;
  const timeRegex = /^\d{2}:\d{2}$/;
  if (timeRegex.test(time)) {
    scheduleDailyJob(time);
    res.send(`Scheduled daily job at ${time}`);
  } else {
    res.status(400).send('Invalid time format. Use HH:MM (24-hour format).');
  }
});

app.get('/logs', (req, res) => {
  fs.readFile('job-log.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Could not read log file.');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Job Logs</title>
        <style>
          body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .log-container {
            text-align: center;
            max-width: 90%;
          }
          .log-message {
            font-size: 2rem;
            white-space: pre-line;
          }
        </style>
      </head>
      <body>
        <div class="log-container">
          <div class="log-message" id="log">${data || 'No logs yet!'}</div>
        </div>
        <script>
          setTimeout(() => window.location.reload(), 5000);
        </script>
      </body>
      </html>
    `);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Job Scheduler running on http://localhost:${PORT}`);
});
