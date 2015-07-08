var mongoose = require('mongoose');
var dbconfig = require('../dbconfig');
var dbURI = dbconfig.dbURI
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
    date: Date
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
    var myQuery = TestModel.find({ date: { $gte: new Date(2016, 03, 21) }}).sort( { date: 1 }).limit(1);
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

exports.getFutureDude = function(req, res){
    var myQuery = TestModel.find({ date: { $gte: new Date(2016, 03, 21) }}).sort( { date: 1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error';
        }
    });
}

exports.getPastDude = function(req, res){
    var myQuery = TestModel.find({ date: { $lt: new Date(2016, 03, 21) }}).sort( { date: -1 }).limit(1);
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




// var myQuery = TestModel.find();
// myQuery.exec(function(err, dudes){
//     if(!err){
//         //console.log(dudes);
//     }
// });


