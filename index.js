const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const Messages = require('./messages/model')
const cors = require('cors')
//initialize the server
const app = express()

//allow cross-origin resource sharing
app.use(cors())
//read request bodies
const jsonParser = bodyParser.json()
app.use(jsonParser)

Messages
  .findAll()
  .then(messages => {
    //serialize the data
    const json = JSON.stringify(messages)
    //initialize the event source
    const stream = new Sse(json) // when clients connect they see messages

    //listen for new clients
    function onStream (req,res){
      stream.init(req, res) //registers client for the stream
    }
    app.get('/stream', onStream)

    function onMessage (req, res, next) {
      console.log('req.body test:', req.body)
      Messages
        .create(req.body)
        .then(message => {
          if (!message) {
            return res.status(404).send({
              message: `message does not exist`
            })
          }

          Messages
            .findAll()
            .then(messages => {

              const json = JSON.stringify(messages)
              stream.updateInit(json)
              stream.send(json)

              return res.send(message)
            })
        })
        .catch(error => next(error))
    }

    app.post('/message', onMessage)

    //start server
    const port = process.env.PORT || 5000
    function onListen () {
      console.log(`Listening on port ${port}`)
    }
    app.listen(port, onListen)
  })