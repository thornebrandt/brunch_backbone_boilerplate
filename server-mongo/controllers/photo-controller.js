var dbconfig = require('../../dbconfig');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var gm = require('gm').subClass({imageMagick: true});


var PhotoModel = require('../models/photo-model.js');


var self = {

    getPhotosByDude: function(req, res){
        var dude_id = req.params.dude_id;
        var query = PhotoModel.find({dude_id : dude_id }).sort( { updated_at: 1 })
        query.exec(function(err, photos){
            if(!err){
                res.json(photos);
            } else {
                handleError(err);
            }
        });
    },

    getPhoto: function(req, res){
        var id = req.params.id;
        PhotoModel.findById(id, function(err, _model){
            if(!err){
                res.json(_model);
            } else {
                return handleError(err);
            }
        });
    },

    deletePhoto: function(req, res){
        var id = req.body._id;
        PhotoModel.findById(id, function(err, _model){
            _model.remove(function(err){
                if(err) return handleError(err);
                res.send(_model);
            });
        });
    },

    savePhoto: function(req, res){
        var id = req.body._id;
        PhotoModel.findById(id, function(err, _model){
            if(!err){
                _model.set(req.body)
                _model.save(function(err){
                    if(err) return handleError(err);
                    res.send(_model);
                });
            } else {
                return 'error updating photo';
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
                    req.body.thumb = dbconfig.upload_path + "/thumbs/" + thumb_name;
                    callback(req, res);
                } else {
                    console.log("error making thumbnail");
                    console.log(err);
                    return err;
                }
            });
    },


    postPhoto: function(req, res){
        req.body.photo = dbconfig.upload_path + req.files.photo.name;
        var photoModel = new PhotoModel(req.body);
        photoModel.save(function(err, _model){
            if(!err){
                res.json(_model);
            } else {
                return err;
            }
        });
    },

}

module.exports = self;

