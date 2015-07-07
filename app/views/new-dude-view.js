var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/new-dude-template');
var DudeModel = require('../models/dude-model');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    events: {
        'submit #dudeForm' : 'submitDudeFormHandler'
    },
    submitDudeFormHandler: function(e){
        e.preventDefault();
        //console.log( $(e.target).serializeObject() );
        this.model = new DudeModel( $(e.target).serializeObject() );
        console.log(this.model);
    }
})
