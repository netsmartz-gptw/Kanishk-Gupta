require('dotenv').config({path:`${__dirname}/../../../.env`})

module.exports = {
    localhost: {
        username: process.env.MYSQL_USENAME_DEV,
        password: process.env.MYSQL_PASSWORD_DEV,
        database: process.env.MYSQL_DATABASE_DEV,
        host:     process.env.MYSQL_HOST_DEV,
        dialect: "mysql",
        logging: false
    },
    dev: {
        username: process.env.MYSQL_USENAME_LIVE,
        password: process.env.MYSQL_PASSWORD_LIVE,
        database: process.env.MYSQL_DATABASE_LIVE,
        host:     process.env.MYSQL_HOST_LIVE,
        dialect: "mysql",
        logging: false
    },
    qa: {
        username: process.env.MYSQL_USENAME_LIVE,
        password: process.env.MYSQL_PASSWORD_LIVE,
        database: process.env.MYSQL_DATABASE_LIVE,
        host:     process.env.MYSQL_HOST_LIVE,
        dialect: "mysql",
        logging: false
    },
    uat: {
        username: process.env.MYSQL_USENAME_LIVE,
        password: process.env.MYSQL_PASSWORD_LIVE,
        database: process.env.MYSQL_DATABASE_LIVE,
        host:     process.env.MYSQL_HOST_LIVE,
        dialect: "mysql",
        logging: false
    },
    prod: {
        username: process.env.MYSQL_USENAME_LIVE,
        password: process.env.MYSQL_PASSWORD_LIVE,
        database: process.env.MYSQL_DATABASE_LIVE,
        host:     process.env.MYSQL_HOST_LIVE,
        dialect: "mysql",
        logging: false
    }
}