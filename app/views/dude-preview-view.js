var ModelView     = require('./model-view');
var template = require('../templates/dude-preview-template');
var DudeModel = require('../models/dude-model');

module.exports = ModelView.extend({
    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },
    template: template,
})
