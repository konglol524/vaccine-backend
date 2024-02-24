const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.SQL_PASS,
    database: 'vacCenter'
});

module.exports = connection;