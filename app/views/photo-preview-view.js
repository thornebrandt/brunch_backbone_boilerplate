var ModelView     = require('./model-view');
var template = require('../templates/photo-preview-template');
var DudeModel = require('../models/photo-model');

module.exports = ModelView.extend({
    events: {
        "click .dudePreview" : "goToSpecificDude"
    },
    template: template,
})
