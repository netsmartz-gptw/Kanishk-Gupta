const express = require('express')
const app = express()
const cors = require('cors');
const helmet = require("helmet");
require('./config/mongoConnection')

const { handleError } = require("./helpers/errorHandler");
const chores = require('./routes/choresRoute');
const { Chore } = require('./models');

// include cron script with configuration to run on specified time
require('./cron')
require('./mysql/relations')

// middlewares
app.use(helmet());      // Secure HTTP headers
app.use(cors())
app.use(express.json())

const userRoute = process.env.NODE_ENV === 'production' ? '/' : '/chores';
app.use(userRoute, chores);

// Always use the end of other middlewares and routes for it to function correctly
app.use((err, req, res, next) => {
    handleError(err, res);
})

module.exports = app