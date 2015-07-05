var application = require('application');
console.log("initialize");


$(function() {
    application.initialize()
    Backbone.history.start()
})
