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
  var Id = parseInt(req.body.Id);
  var op = req.body.op;
  var HRA, DA;
  if (income <= 10000) {
    HRA = (income * 20) / 100;
    DA = (income * 80) / 100;
  } else if (income > 10001 && income <= 20000) {
    HRA = (income * 25) / 100;
    DA = (income * 90) / 100;
  } else {
    HRA = (income * 30) / 100;
    DA = (income * 95) / 100;
  }
  var gross_income = income + HRA + DA;

  if (op == 'add') {
    const user = new database.User({
      name: name,
      email: email,
      income: income,
      Id:Id,
      gross_income: gross_income,
    }).save();
    return res.send('insertion successful');
  } else if (op == 'update') {
    console.log(Id)
    database.User.updateOne(
      { Id },
      {
        name,
        income,
        email,
        gross_income: gross_income,
      },
    );
    return res.send('successfully updated');
  } else if (op == 'del') {
    database.User.deleteOne({ name });
    return res.send('successfully deleted');
  } else if (op == 'display') {
    database.User.find({ name }).then((employees) => {
      var abc =
        '<html><head><title>Display Data</title></head><body><h1>Display Data</h1>{${table}}</body></html>';
      var table = '';
      for (var i = 0; i < employees.length; i++) {
        table +=
          '<tr><td>' +
          (i + 1) +
          '</td><td>' +
          employees[i].name +
          '</td><td>' +
          employees[i].email +
          '</td><td>' +
          employees[i].income +
          '</td><td>' +
          employees[i].Id +
          '</td><td>' +
          employees[i].gross_income +
          '</td></tr>';
      }
      table =
        '<table border="3"><tr><th>Sr</th><th>Name</th><th>Email</th><th>Income</th><th>Emp Id</th><th>Gross Income</th>' +
        table +
        '</table>';
      abc = abc.replace('{${table}}', table);
      table = res.send(abc);
    });
  }
});

app.listen(3000);
console.log('Server is running.');
