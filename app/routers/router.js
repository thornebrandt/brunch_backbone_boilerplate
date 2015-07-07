var App = require('application');

module.exports = Backbone.Router.extend({
    initialize: function(){
        console.log("initializing router");
        App.Views.AppView = require('../views/app-view');
        App.Views.IndexView = require('../views/index-view');
        App.Views.DudesView = require('../views/dudes-view');
        App.Views.NewDudeView = require('../views/new-dude-view');

    },

    routes: {
        '': 'index',
        'dudes': 'dudes',
        'dudes/new': 'newDude'
    },

    index: function() {
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.indexView = new App.Views.IndexView();
        App.views.indexView.render();
    },

    dudes: function(){
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.dudesView = new App.Views.DudesView();
        App.views.dudesView.render();
    },

    newDude: function(){
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.newDudeView = new App.Views.NewDudeView();
        App.views.newDudeView.render();
    }
})
