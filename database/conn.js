var mysql = require("mysql")
require('dotenv').config();

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "salonfinder"
})

conn.connect((err) => {
    if (err) throw err;
    console.log("Database Connected...")
})

module.exports = conn;
