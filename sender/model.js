const Sequelize = require('sequelize')
const sequelize = require('../db')


 const Sender = sequelize.define('sender', {
  name: {
    type: Sequelize.STRING
  }
  
})


module.exports = Sender