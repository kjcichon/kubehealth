var express = require('express')
var app = express()
var session = require("express-session");

app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));

app.get('/unready', function (req, res) {
  session.ready='no';
  console.log("not ready");
  res.send('I am not ready yet');
})

app.get('/ready', function (req, res) {
  session.ready='yes';
  console.log("Setting ready to yes");
  res.send('Ready fredy');
})

app.get('/isready', function (req, res) {
  var ready = session.ready;
  console.log("hitting ready probe=" + ready)
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
  console.log("dead");
  res.send('I am undead');
})

app.get('/alive', function (req, res) {
  session.alive='yes';
  console.log("alive");
  res.send('alive');
})

app.get('/islively', function (req, res) {
  var alive = session.alive;
  console.log("hitting lively probe=" + alive)
  if (alive==='no'){
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
  console.log('Example app listening on port 8080!')
})
