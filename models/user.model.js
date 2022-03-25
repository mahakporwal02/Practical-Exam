const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  income: Number,
  deduction: Number,
  tax: Number
})
mongoose.model('Employees', userSchema)
