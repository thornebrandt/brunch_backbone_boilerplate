var dbconfig = require('../../dbconfig');
var DudeModel = require('../models/dude-model.js');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

var self = {
    doSomething: function(){
        return "do it!!!!!";
    },

    dudes: function(req, res){
        res.json({ what: "is this"});
    },

    getDudes: function(req, res){
        var myQuery = DudeModel.find().sort( { date: -1 });
        myQuery.exec(function(err, dudes){
            if(!err){
                res.json(dudes);
            } else {
                return handleError(err);
            }
        });
    },

    getCurrentDude: function(req, res){
        var myQuery = DudeModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
        myQuery.exec(function(err, dudes){
            if(!err){
                if(dudes.length > 0){
                    res.json(dudes);
                } else {
                    self.getPastDude(req, res);
                }
            } else {
                handleError(err);
            }
        });
    },

    getDude: function(req, res){
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
    },

    deleteDude: function(req, res){
        var id = req.body._id;
        DudeModel.findById(id, function(err, dude){
            dude.remove(function(err){
                if(err) return handleError(err);
                res.send(dude);
            });
        });
    },

    editDude: function(req, res){
        var id = req.body._id;
        if(req.files && typeof req.files.photo !== "undefined"){
            self.savePhotoAndThumb(req, res, self.updateDude) ;
        } else if(req.files && typeof req.files.thumb !== "undefined"){
            self.saveThumb(req, res, self.updateDude);
        } else {
            self.updateDude(req, res);
        }
    },

    saveThumb: function(req, res, callback){
        var file_string = req.files.thumb.name;
        var file_name = file_string.substr(0, file_string.lastIndexOf('.'));
        var thumb_name = file_name + "_thumb." + req.files.thumb.extension;
        var thumb_path = dbconfig.thumb_path + thumb_name;
        fs.rename(req.files.thumb.path, thumb_path, function(err){
            if(!err){
                req.body.thumb = dbconfig.upload_path + "thumbs/" + thumb_name;
                callback(req, res);
            } else {
                console.log("error moving thumb...");
                console.log(err);
                return handleError(err);
            }
        });

    },


    savePhotoAndThumb: function(req, res, callback){
        var file_string = req.files.photo.name;
        var file_name = file_string.substr(0, file_string.lastIndexOf('.'));
        var thumb_name = file_name + "_thumb." + req.files.photo.extension;
        gm(req.files.photo.path)
            .resize('100', '100', '^')
            .gravity('Center')
            .crop('100', '100')
            .write(dbconfig.thumb_path + thumb_name, function(err){
                if(!err){
                    req.body.photo = dbconfig.upload_path + req.files.photo.name;
                    req.body.thumb = dbconfig.upload_path + "thumbs/" + thumb_name;
                    callback(req, res);
                } else {
                    console.log("error making thumbnail");
                    console.log(err);
                    return err;
                }
            });
    },

    updateDude: function(req, res){
        var id = req.body._id;
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
    },

    postDude: function(req, res){
        self.savePhotoAndThumb(req, res, self.saveDude);
    },

    saveDude: function(req, res){
        var dude = new DudeModel(req.body);
        dude.save(function(err, _model){
            if(!err){
                res.json(_model);
            } else {
                return err;
            }
        });
    },

    getFutureDude: function(req, res){
        var myQuery = DudeModel.find({ date: { $gte: new Date() }}).sort( { date: 1 }).limit(1);
        myQuery.exec(function(err, dudes){
            if(!err){
                res.json(dudes);
            } else {
                return 'error getting future dude';
            }
        });
    },

    getPastDude: function(req, res){
        var myQuery = DudeModel.find({ date: { $lt: new Date() }}).sort( { date: -1 }).limit(1);
        myQuery.exec(function(err, dudes){
            if(!err){
                res.json(dudes);
            } else {
                return 'error getting past dude';
            }
        });
    }
}

module.exports = self;

