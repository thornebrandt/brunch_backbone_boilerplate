window.App = require('application');

$(function() {
    window.App.initialize();
    Backbone.history.start({ pushState: true });
})
