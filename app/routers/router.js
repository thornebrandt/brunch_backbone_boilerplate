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
        'dudes/:date/:dude' : 'specificDude',
        'dudes/:data/:dude/edit' : 'editSpecificDude'
    },

    loadApp: function(){
        if(!App.views.appView) {
            App.views.appView = new App.Views.AppView();
            App.views.appView.render();
        }
    },

    index: function() {
        this.loadApp();
        App.views.indexView = new App.Views.IndexView();
        App.views.indexView.render();
    },

    specificDude: function(_date, _dude){
        this.loadApp();
        App.views.dudeView = new App.Views.DudeView();
        App.views.dudeView.URLdate = _date;
        App.views.dudeView.dude = _dude;
        App.views.dudeView.findDude();
    },

    editSpecificDude: function(_data, _dude){
        this.loadApp();
        console.log("editing dude view will go here");
    },


    dudes: function(){
        this.loadApp();
        App.views.dudesView = new App.Views.DudesView();
        App.views.dudesView.render();
    },

    newDude: function(){
        this.loadApp();
        App.views.newDudeView = new App.Views.NewDudeView();
        App.views.newDudeView.render();
    },


    setupAjax: function(){
        $.ajaxSetup({
            crossDomain: true
        });
    }


})
