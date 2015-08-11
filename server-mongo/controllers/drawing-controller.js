var dbconfig = require('../../dbconfig');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});


var DrawingModel = require('../models/drawing-model.js');


var self = {
    getDrawings: function(req, res){
        var _query = DrawingModel.find().sort( { updated_at: -1 });
        _query.exec(function(err, _models){
            if(!err){
                res.json(_models);
            } else {
                return handleError(err);
            }
        });
    },

    saveDrawing: function(req, res){
        var buf = new Buffer(req.body.drawing, 'base64');
        var drawing_img = Date.now() + "_drawing.png";
        fs.writeFile(dbconfig.image_path + drawing_img, buf, function(err){
            if(!err){
                var drawing = new DrawingModel({
                    drawing: dbconfig.upload_path + drawing_img
                });
                drawing.save(function(err, _model){
                    if(!err){
                        res.json(_model);
                    } else {
                        return err;
                    }
                });
            } else {
                return handleError(err);
            }
        });
    },

    postDrawing: function(req, res){
        self.saveDrawing(req, res);
    }

}

module.exports = self;

