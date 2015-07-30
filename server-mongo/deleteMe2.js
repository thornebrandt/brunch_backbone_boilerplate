var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var restify = require('restify');
var config = require('../dbconfig.js');
var connect = require('connect');


mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', function(err){
    console.log("mongoose connection error");
    console.log(err);
});

mongoose.connection.on('open', function(){
    console.log("connected to mongoose")
    mongodbServer.use(restify.bodyParser());
    var Schema = mongoose.Schema;

    var TestSchema = new Schema({
        dude: String,
        greeting: String,
        date: Date
    });

    mongoose.model('TestCollection', TestSchema);
    var TestModel= mongoose.model('TestCollection');
    TestModel.find(function(err, data){
        console.log("findin");
        console.log(data);
    });


    function getTests(req, res, next){
        // Resitify currently has a bug which doesn't allow you to set default headers
        // This headers comply with CORS and allow us to server our response to any origin
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // the `-1` in .sort() means descending order
        console.log("gettin tests!!");
        TestSchema.find().sort('date', -1).execFind(function(arr, data){
            res.send(data);
        });
    }

    mongodbServer.get('/getTests', getTests);

});



var mongodbServer = restify.createServer({
    formatters: {
        'application/json': function(req, res, body){
            console.log("json");
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'text/html': function(req, res, body){
            return body;
        }
    }
});


