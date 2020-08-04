var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'qwerty',
    database: 'testcasegen'
})


  
connection.connect()

module.exports = connection;