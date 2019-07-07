const Sequelize = require('sequelize')
const sequelize = require('../db')
const Sender =  require('../sender/model')



const Messages = sequelize.define('message', {
  message: {
    type: Sequelize.STRING,
  }
})

Messages.belongsTo(Sender)
module.exports = Messages