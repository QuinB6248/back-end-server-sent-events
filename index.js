const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const cors = require('cors')
//initialize the server
const app = express()

//allow cross-origin resource sharing
app.use(cors())
//read request bodies
const jsonParser = bodyParser.json()
app.use(jsonParser)



//Our data store - basically the database for now
const messages = [
  'hello',
  'can you see this'
]

//serialize the data
const json =JSON.stringify(messages)
//initialize the event source
const stream = new Sse(json) // when clients connect they see messages



//listen for new clients
function onStream (req,res){
  stream.init(req, res) //registers client for the stream
}
app.get('/stream', onStream)

//Listens for new messages
function onMessage (req, res) {
  const { message } = req.body
  //add message to data store
  messages.push(message)
  //reserialize(make string) the store
  const json = JSON.stringify(messages)
  //update initial data
  stream.updateInit(json)
  //Notify all clients
  stream.send(json)
  //send a response
  return res.status(201).end(message)
}
app.post('/message', onMessage)








//start server
const port = 5000
function onListen () {
  console.log(`Listening on port ${port}`)
}
app.listen(port, onListen)