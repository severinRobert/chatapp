const express = require('express')
const app = express()
const cors = require('cors')

// set headers for cors
app.use(cors({ origin: 'http://localhost:3000' , credentials :  true}));

app.get('/', (req, res) => {
  res.send("Hello World !")
})

module.exports = app;