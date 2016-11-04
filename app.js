var express = require('express')
var app = express()
var session = require("express-session");

app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));

app.get('/kill', function (req, res) {
  session.kill='yes';
  res.send('I am not doing so well')
})

app.get('/alive', function (req, res) {
  session.kill='no';
  res.send('Back to life')
})

app.get('/healthz', function (req, res) {
  var kill = session.kill;
  if (kill==='yes'){
    res.status(404)        // HTTP status 404: NotFound
        .send('Not found');
  } else {
    res.status(200)
        .send('All Good');
  }
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
