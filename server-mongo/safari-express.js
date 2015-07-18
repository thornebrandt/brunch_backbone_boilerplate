var express = require('express'),
    request = require('request'),
    fs = require('fs'),
    db = require('./safari-mongo'),
    dbconfig = require('../dbconfig'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    cors = require('cors')

var done = false;

var app = express();

app.use(cors());

var multerOptions = {
    dest: 'public/uploads',
    rename: function(fieldname, filename){
        return filename + Date.now()
    },
    onFileUploadStart: function(file){
        console.log(file.originalname + ' is uploading ...');
    },
    onFileUploadComplete: function(file){
        console.log(file.fieldname + ' was uploaded to ' + file.path);
        done = true;
    }
}



app.use(multer(multerOptions));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


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


app.post('/api/photo', function(req, res, next){
    console.log("posting to /api/photo: req:");
    console.log(req);
    res.json({files: req.files});
});



var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening on http://%s:%s', host, port);
});
