var ModelView     = require('./model-view');
var template = require('../templates/dude-preview-template');
var DudeModel = require('../models/dude-model');

module.exports = ModelView.extend({
    events: {
        "click .dudePreview" : "goToSpecificDude"
    },
    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },
    goToSpecificDude: function(e){
        e.preventDefault();
        var dude = $(e.target).attr("data-dude");
        var date = $(e.target).attr("data-date");
        var url =   "/dudes/" + date + "/" + dude;
        App.router.navigate(url, { trigger: true });
    },
    template: template,
})
