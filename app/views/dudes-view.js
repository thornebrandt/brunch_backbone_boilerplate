var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/index');
var DudeModel = require('../models/dude-model');
var DudeCollection = require('../collections/dude-collection');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    afterRender: function(){
        this.setupDudeCollection();
    },
    setupDudeCollection: function(){
        this.dudeCollection = new DudeCollection();
        var self = this;
        this.dudeCollection.fetch({
            url: BASE_URL + "/dudes",
            success: function(data){
                self.renderDudeCollection();
            },
            error: function(collection, response){
                console.log("something went wrong getting dudes");
                console.log(response);
            }
        });
    },
    renderDudeCollection: function(){
        var self = this;
        this.dudeCollection.each(function(model){
            $(self.el).append("<div class='dudePreviewContainer' id='" + model.get("_id") + "'></div>");
            var dudePreviewView = new DudePreviewView(model);
            dudePreviewView.render();
        });
    }
})
