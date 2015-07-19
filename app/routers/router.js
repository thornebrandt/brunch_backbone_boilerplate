var App = require('application');

module.exports = Backbone.Router.extend({
    initialize: function(){
        console.log("initializing router");
        App.Views.AppView = require('../views/app-view');
        App.Views.IndexView = require('../views/index-view');
        App.Views.DudesView = require('../views/dudes-view');
        App.Views.DudeView = require('../views/dude-view');
        App.Views.NewDudeView = require('../views/new-dude-view');
        this.setupAjax();

    },

    routes: {
        '': 'index',
        'dudes': 'dudes',
        'dudes/new': 'newDude',
        'dudes/:date/:dude' : 'specificDude'
    },

    index: function() {
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.indexView = new App.Views.IndexView();
        App.views.indexView.render();
    },

    specificDude: function(_date, _dude){
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
        App.views.dudeView = new App.Views.DudeView();
        App.views.dudeView.URLdate = _date;
        App.views.dudeView.dude = _dude;
        App.views.dudeView.findDude();
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
    },


    setupAjax: function(){
        $.ajaxSetup({
            crossDomain: true
        });
    }


})
