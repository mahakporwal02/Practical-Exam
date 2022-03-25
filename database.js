const mongoose = require('mongoose')

const mongooseOptions = {
  keepAlive: true,
  connectTimeoutMS: 30000
}
require('./models/user.model')
module.exports = {
  User: mongoose.model('Employees'),
  connect () {
    mongoose.connect('mongodb://localhost:27017/employee', mongooseOptions)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.log(err))
  }
}
