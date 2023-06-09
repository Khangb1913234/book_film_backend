const mysql = require("mysql")
const dotenv = require("dotenv")
dotenv.config()

var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
});
  
connection.connect(function(err) {
    if (err){
        console.log(err)
    }
    console.log("Connected!");
});

module.exports = connection