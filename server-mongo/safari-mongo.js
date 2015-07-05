var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);

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
    var myQuery = TestModel.find();
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
            //console.log(dudes);
        } else {
            return 'error';
        }
    });
}

// Build the Project model
// mongoose.model( 'Project', projectSchema );

// var newModel = new TestModel({
//     dude: 'fromCode',
//     hey: 'waz',
//     date: new Date()
// });

// newModel.save(function(err){
//     if(!err){
//         console.log('User saved');
//     } else {
//         console.log("error saving model");
//         console.log(err);
//     }
// });


var myQuery = TestModel.find();
myQuery.exec(function(err, dudes){
    if(!err){
        //console.log(dudes);
    }
});


