var dbconfig = require('../../dbconfig');
var DudeModel = require('../models/dude-model.js');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";

exports.doSomething = function(){
    return "do it!!!!!";
}

exports.dudes = function(req, res){
    res.json({ what: "is this"});
}

exports.getDudes = function(req, res){
    console.log("getting dudes from my bombass controller");
    var myQuery = DudeModel.find().sort( { date: -1 });
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error';
        }
    });
}

exports.getCurrentDude = function(req, res){
    var myQuery = DudeModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
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
    var query = DudeModel.findOne({
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
            return 'error getting dude';
        }
    });
}


exports.updateDude = function(req, res){
    var id = req.params._id;
    DudeModel.findById(id, function(err, dude){
        if(!err){
            dude = req.params;
            dude.save(function(err){
                if(err) return handleError(err);
                res.send(dude);
            });
        } else {
            return 'error updating dude';
        }
    })
}


exports.getFutureDude = function(req, res){
    var myQuery = DudeModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error getting future dude';
        }
    });
}

exports.getPastDude = function(req, res){
    var myQuery = DudeModel.find({ date: { $lt: new Date() }}).sort( { date: -1 }).limit(1);
    myQuery.exec(function(err, dudes){
        if(!err){
            res.json(dudes);
        } else {
            return 'error getting past dude';
        }
    });
}

exports.postDude = function(req, res){
    var dude = new DudeModel(req.body);
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
    var dude = new DudeModel(req.body);
    dude.save(function(err, dude){
        if(!err){
            res.json(dude);
        } else {
            return err;
        }
    });
}