var express = require('express'),
    db = require('./safari-mongo'),
    dbconfig = require('../dbconfig'),
    bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', dbconfig.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.get('/', function(req, res){
    res.send('hello...?');
});
app.get('/balls', function(req, res){
    res.send('congrats, you get balls');
});
app.get('/something', function(req, res){
    res.send(db.doSomething());
});
app.get('/currentDude', db.getCurrentDude);

app.get('/dudes', db.getDudes);

app.post('/dudes/new', db.postDude);

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening on http://%s:%s', host, port);
});