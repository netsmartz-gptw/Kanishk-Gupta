const cron = require('node-cron');
const deleteChoreTransactions = require("./deleteChoreTransactions")
const fetchDueChores = require("./fetchDueChores");
const lostEarnings = require('./lostEarning');

// set cron to run every day at 1AM and delete 30 days old chore transactions
cron.schedule('0 1 * * *', deleteChoreTransactions, {
  scheduled: true,
  timezone: "America/Chicago"
})

cron.schedule('0 18 * * *', fetchDueChores, {
  scheduled: true,
  timezone: "America/Chicago"
})

// run lost earning script every sunday for past week lost earnings chores
cron.schedule('0 1 * * 0', lostEarnings, {
  scheduled: true,
  timezone: "America/Chicago"
})