var express = require('express'),
    request = require('request'),
    fs = require('fs'),
    cors = require('cors'),
    dbconfig = require('../dbconfig'),
    bodyParser = require('body-parser'),
    multer = require('multer')


var db = require('./db');
var dudeController = require('./controllers/dude-controller')
var dudeModel = require('./models/dude-model')

var app = express();
app.use('/', express.static(__dirname + '/'));
app.use(express.static(__dirname + dbconfig.public_path));
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
    res.send(dudeController.doSomething());
});
app.get('/currentDude', dudeController.getCurrentDude);
app.get('/dude/:date/:dude', dudeController.getDude);
app.get('/dudes', dudeController.getDudes);
app.delete('/dude', dudeController.deleteDude);
app.post('/dudes/new', dudeController.postDude);
app.patch('/dudes/edit', dudeController.updateDude);
app.post('/api/photo', dudeController.postDudePhoto);



var server = app.listen(dbconfig.PORT_NUMBER, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening on http://%s:%s', host, port);
});

