var url = require('url');
const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
const database = require('./database');
const { User } = require('./database');
database.connect();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', urlencodedParser, (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var income = parseInt(req.body.income);
  var deduction = parseInt(req.body.deduction);
  var op = req.body.op;
  var tax = income - (deduction + 50000);
  if (tax <= 250000) {
    var taxrate = 0;
  } else if (tax > 250000 && tax <= 500000) {
    var taxrate = 5;
  } else if (tax > 500000 && tax <= 1000000) {
    var taxrate = 20;
  } else {
    var taxrate = 30;
  }

  if (op == 'add') {
    const user = new database.User({
      name: name,
      email: email,
      income: income,
      deduction: deduction,
      tax: taxrate,
    }).save();
    return res.send('insertion successful');
  } else if (op == 'update') {
    database.User.updateOne(
      { email },
      {
        name,
        income,
        deduction,
        tax: taxrate,
      },
    );
    return res.send('successfully updated');
  } else if (op == 'del') {
    console.log(email);
    database.User.deleteOne({ email });
    return res.send('successfully deleted');
  } else if (op == 'display') {
    database.User.find({ name }).then((employees) => {
      console.log(employees);
      var reo =
        '<html><head><title>Display Data</title></head><body><h1>Display Data</h1>{${table}}</body></html>';
      var table = '';
      for (var i = 0; i < employees.length; i++) {
        table +=
          '<tr><td>' + (i + 1) + '</td><td>' + employees[i].name + '</td><td>' + employees[i].email + '</td><td>' + employees[i].income + '</td><td>' + employees[i].deduction + '</td><td>' + employees[i].tax + '</td></tr>';
        }
        table =
          '<table border="3"><tr><th>Sr</th><th>Name</th><th>Email</th><th>Income</th><th>Deduction</th><th>Taxable Income</th>' +
          table +
          '</table>';
          reo = reo.replace('{${table}}', table);
      table = res.send(reo);
    });
  }
});

app.listen(3000);
console.log('Server is running.');
