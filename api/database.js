const mysql = require("mysql")

const connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "root",
  database : "chat-app"
})

connection.connect((err) => {
  if(err) throw err
  console.log("Connected to MySQL Server!")
})

module.exports.connection = connection