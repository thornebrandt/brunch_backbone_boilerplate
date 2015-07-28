var mongoose = require('mongoose');
var dbconfig = require('../dbconfig');
var dbURI = dbconfig.dbURI;
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";

mongoose.connect(dbconfig.dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});


var testSchema = new mongoose.Schema({
    dude: String,
    greeting: String,
    date: Date,
    photo: String
},
{
    collection: 'testCollection'
});


mongoose.model('TestModel', testSchema);

var TestModel = mongoose.model('TestModel');
var projectSchema = new mongoose.Schema({
  projectName: String,
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  createdBy: String,
  contributors: String,
  tasks: String
});


exports.doSomething = function(){
    return "do it!!!!!";
}

exports.dudes = function(req, res){
    res.json({ what: "is this"});
}

exports.getDudes = function(req, res){
    console.log("getting dudes");
    var myQuery = TestModel.find().sort( { date: -1 });
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error';
        }
    });
}

exports.getCurrentDude = function(req, res){
    var myQuery = TestModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            if(dudes.length > 0){
                res.json(dudes);
            } else {
                exports.getPastDude(req, res);
            }
        } else {
            return 'error';
        }
    });
}


exports.getDude = function(req, res){
    var UTC_date = req.params.date;
    var _dude = req.params.dude;
    var next_UTC_date = new moment(req.params.date, UTC_format)
        .add(1, "days")
        .format(UTC_format);
    var query = TestModel.findOne({
        date: {
            $gte: new Date(UTC_date),
            $lte: new Date(next_UTC_date)
        },
        dude: {
            $eq: _dude
        }
    });
    query.exec(function(err, dude){
        if(!err){
            res.json(dude);
        } else {
            return 'error';
        }
    });
}


exports.getFutureDude = function(req, res){
    var myQuery = TestModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error';
        }
    });
}

exports.getPastDude = function(req, res){
    var myQuery = TestModel.find({ date: { $lt: new Date() }}).sort( { date: -1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error';
        }
    });
}

exports.postDude = function(req, res){
    var dude = new TestModel(req.body);
    dude.save(function(err, dude){
        if(!err){
            res.json(dude);
        } else {
            return err;
        }
    });
}

exports.postDudePhoto = function(req, res){
    console.log("files");
    console.log(req.files);
    req.body.photo = dbconfig.upload_path + req.files.photo.name;
    console.log("body");
    console.log(req.body);
    var dude = new TestModel(req.body);
    dude.save(function(err, dude){
        if(!err){
            res.json(dude);
        } else {
            return err;
        }
    });
}


