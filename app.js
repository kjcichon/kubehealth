var express = require('express')
var app = express()
var session = require("express-session");

var bunyan = require('bunyan');

var log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: process.stdout,            // log INFO and above to stdout
      formatter:'pretty'
    },
    {
      type: 'rotating-file',
      level: 'info',
      path: '/var/tmp/myapp-info.log',  // log INFO and above to a file
      period: '1d',   // daily rotation
      count: 30        // keep 3 back copies
    },
    {
      type: 'rotating-file',
      level: 'error',
      path: '/var/tmp/myapp-error.log',  // log ERROR and above to a file
      period: '1d',   // daily rotation
      count: 30        // keep 3 back copies
    }
  ]
});


var logData= {domain: 'collections', type: 'WEBREQ'};
var logDataService= {domain: 'collections', type: 'SERVICE'};

app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));

app.get('/unready', function (req, res) {
  session.ready='no';
  log.info(logData,"not ready");
  res.send('I am not ready yet');
})

app.get('/ready', function (req, res) {
  session.ready='yes';
  log.info(logData,"Setting ready to yes");
  res.send('Ready fredy');
})

app.get('/isready', function (req, res) {
  var ready = session.ready;
  log.info(logData,"hitting ready probe=" + ready)
  if (ready==='no'){
    res.status(404)        // HTTP status 404: NotFound
        .send('Not ready');
  } else {
    res.status(200)
        .send('ready');
  }
})

app.get('/dead', function (req, res) {
  session.alive='no';
  log.info(logData,"dead");
  res.send('I am undead');
})

app.get('/alive', function (req, res) {
  session.alive='yes';
  log.info(logData,"alive");
  res.send('alive');
})

app.get('/islively', function (req, res) {
  var alive = session.alive;
  log.info(logData,"hitting lively probe=" + alive)
  if (alive==='no'){
    log.error(logData,err);
    res.status(404)        // HTTP status 404: NotFound
        .send('not alive');
  } else {
    res.status(200)
        .send('breathing');
  }
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.listen(8080, function () {
  log.info(logDataService,'Example app listening on port 8080!')
})
