const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
const db = require('./database')

let jsonParser = bodyParser.json()

// set headers for cors
app.use(cors({ origin: 'http://localhost:3000' , credentials :  true}));

const esc = (input) => db.connection.escape(input)

/* GET */
app.get('/', (req, res) => {
  res.send("API is working")
})

/* GET user */
app.get('/user', (req, res) => {
  db.connection.query("SELECT * FROM user", (err, rows) => {
    if(err) throw err
    console.log(rows)
    res.status(200).json(rows)
  })
})

/* POST user */
app.post('/user', jsonParser, (req, res) => {
  const pseudo = req.body.pseudo
  db.connection.query(`SELECT pseudo FROM user WHERE pseudo=${esc(pseudo)}`, (err, rows) => {
    if(err) throw err
    if(rows.length=0) { 
      db.connection.query(`INSERT INTO user (pseudo) VALUES (${esc(pseudo)})`, (err, rows) => {
        if(err) throw err
        res.status(200).json(rows)
      })
    } else res.status(400).send("pseudo already used")
  })
})

/* GET message */
app.get('/message', (req, res) => {
  db.connection.query("SELECT * FROM message INNER JOIN user ON user.id=message.user_id", (err, rows) => {
    if(err) throw err
    res.status(200).json(rows)
  })
})

/* POST message */
app.post('/message', jsonParser, (req, res) => {
  const text = req.body.text
  const user_id = req.body.user_id
  db.connection.query(`INSERT INTO message (text, user_id) VALUES (${esc(text)},${esc(user_id)})`, (err, rows) => {
    if(err) throw err
    res.status(200).send("message added")
  })
})

module.exports = app;