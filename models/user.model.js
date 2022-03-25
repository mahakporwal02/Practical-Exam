const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  income: Number,
  Id: Number,
  gross_income: Number
})
mongoose.model('Employees', userSchema)
