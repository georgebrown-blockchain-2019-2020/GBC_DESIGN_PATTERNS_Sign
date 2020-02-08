var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Web3 = require('web3');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const contractInfor = require('./tip-jar');
var app = express();
var Tx = require("ethereumjs-tx").Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];
console.log(contractInfor.CONTRACT_ADDRESS);
var TestContract = new web3.eth.Contract(contractInfor.CONTRACT_ABI, contractInfor.CONTRACT_ADDRESS);
var privateKey = new Buffer.from('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d','hex');
var rawTx = {
    nonce: web3.utils.toHex(3),
    gasPrice: "0x09184e72a000",
    gasLimit: "0x62710",
    to: contractInfor.CONTRACT_ADDRESS,
    value: '0x01',
    data: TestContract.methods.changeOwnerShip("0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0").encodeABI()
  }  
  var tx= new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
