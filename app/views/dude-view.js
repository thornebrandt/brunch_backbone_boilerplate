var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');
var PhotoCollection = require('../collections/photo-collection')
var PhotoPreviewView = require('../views/photo-preview-view');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    afterRender: function(){
        this.fetchPhotos();
    },
    events: {
        'click #backToDudes' : 'backToDudesHandler',
        'click #editDudeBtn' : 'clickEditDudeHandler',
    },
    getRenderData: function(){
        return this.model.toJSON();
    },

    fetchPhotos: function(){
        var _id = this.model.get("_id");
        this.photoCollection = new PhotoCollection();
        var self = this;
        this.photoCollection.fetch({
            url: BASE_URL + "/photos/" + _id,
            success: function(data){
                console.log(data);
                self.renderPhotos();
            },
            error: function(collection, response){
                console.log("something went wrong getting photos");
            }
        });
    },

    renderPhotos: function(){
        this.photoCollection.each(function(model){
            $("#dudePhotos").append("<div class='photoPreviewContainer' id='"+model.get("_id")+"'></div>");
            var photoPreviewView = new PhotoPreviewView(model);
            photoPreviewView.render();
        });
    },


    fetchDude: function(_date, _dude){
        var self = this;
        this.URLdate = _date;
        this.dude = _dude;
        this.date = new moment(this.URLdate, time.url_format).format(time.UTC_format);
        var url = BASE_URL + "/dude/" + this.date + "/" + this.dude;
        this.model = new DudeModel();
        this.model.fetch({
            url: url,
            success: function(data, textStatus, options){
                self.model.formatDate();
                self.render();
            },
            error: function(model, e){
                console.log("something went wrong getting a specific dude");
                console.log(e.responseText);
            }
        });
    },

    backToDudesHandler: function(e){
        e.preventDefault();
        App.router.navigate("/dudes/", { trigger: true });
    },

    clickEditDudeHandler: function(e){
        e.preventDefault();
        var url = "/dudes/" + this.URLdate + "/" + this.dude  + "/edit"
        App.router.navigate(url, { trigger: true });
    },




})
