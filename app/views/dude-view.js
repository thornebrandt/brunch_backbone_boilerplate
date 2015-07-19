var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    // afterRender: function(){
    //     this.findDude();
    // },
    getRenderData: function(){
        return this.model.toJSON();
    },
    findDude: function(){
        var self = this;
        this.date = new moment(this.URLdate, time.url_format).format(time.UTC_format);
        var url = BASE_URL + "/dude/" + this.date + "/" + this.dude;
        this.model = new DudeModel();
        this.model.fetch({
            url: url,
            success: function(data){
                console.log("success getting a dude");
                console.log(data);
                self.render();
            },
            error: function(model, response){
                console.log("something went wrong getting a specific dude");
                console.log(response);
            }
        });
    }
})
