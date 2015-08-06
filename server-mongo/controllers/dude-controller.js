var dbconfig = require('../../dbconfig');
var DudeModel = require('../models/dude-model.js');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var gm = require('gm').subClass({imageMagick: true});


exports.doSomething = function(){
    return "do it!!!!!";
}

exports.dudes = function(req, res){
    res.json({ what: "is this"});
}

exports.getDudes = function(req, res){
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


exports.deleteDude = function(req, res){
    var id = req.body._id;
    console.log("deleting a dude");
    DudeModel.findById(id, function(err, dude){
        dude.remove(function(err){
            if(err) return handleError(err);
            res.send(dude);
        });
    });
}


exports.updateDude = function(req, res){
    var id = req.body._id;
    if(req.files && typeof req.files.photo !== "undefined"){

        console.log("about to identify photo");
        console.log(req.files.photo.path);

        gm(req.files.photo.path).identify(function(err, data){
            if(!err){
                console.log("identifying photo");
                console.log(data);
            } else {
                console.log("err");
                console.log(err);
            }
        });

        DudeModel.findById(id, function(err, dude){
            if(!err){
                dude.set(req.body)
                dude.save(function(err){
                    if(err) return handleError(err);
                    res.send(dude);
                });
            } else {
                return 'error updating dude';
            }
        });
        req.body.photo = dbconfig.upload_path + req.files.photo.name;
    } else {
        res.status(500).send('Not an image!');
    }

}


exports.postDude = function(req, res){
    req.body.photo = dbconfig.upload_path + req.files.photo.name;
    var dude = new DudeModel(req.body);
    dude.save(function(err, dude){
        if(!err){
            res.json(dude);
        } else {
            return err;
        }
    });
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


