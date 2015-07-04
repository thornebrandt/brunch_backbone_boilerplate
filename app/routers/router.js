var App = require('application');

module.exports = Backbone.Router.extend({
    initialize: function(){
        App.Views.AppView = require('../views/app-view');
        App.Views.IndexView = require('../views/index-view');
    },

    routes: {
        '': 'index'
    },

    index: function() {
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.indexView = new App.Views.IndexView();
        App.views.indexView.render();
    }
})
