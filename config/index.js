const { createPool } = require('mysql');
require('dotenv').config();

let connection = createPool({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPwd,
    database: process.env.dbName,
    port: process.env.dbPort,
    multipleStatements: true
});

module.exports = connection;