var App = require('application');

module.exports = Backbone.Router.extend({
    initialize: function(){
        App.Views.AppView = require('../views/app-view');
        App.Views.IndexView = require('../views/index-view');
        App.Views.DudesView = require('../views/dudes-view');
        App.Views.DudeView = require('../views/dude-view');
        App.Views.NewDudeView = require('../views/new-dude-view');
        App.Views.EditDudeView = require('../views/edit-dude-view');
        this.setupAjax();

    },

    routes: {
        '': 'index',
        'dudes(/)': 'dudes',
        'dudes/new(/)': 'newDude',
        'dudes/:date/:dude(/)' : 'specificDude',
        'dudes/:data/:dude/edit(/)' : 'editDude',
        '*path' : 'defaultRoute',
    },

    defaultRoute: function(){
        this.index();
    },


    loadApp: function(){
        if(!App.appView) {
            App.appView = new App.Views.AppView();
            App.appView.render();
        }
        this.garbageCollection();
    },

    index: function() {
        this.loadApp();
        App.views.indexView = new App.Views.IndexView();
        App.views.indexView.render();
    },

    specificDude: function(_date, _dude){
        this.loadApp();
        App.views.dudeView = new App.Views.DudeView();
        App.views.dudeView.fetchDude(_date, _dude);
    },

    editDude: function(_date, _dude){
        this.loadApp();
        App.views.editDudeView = new App.Views.EditDudeView();
        App.views.editDudeView.fetchDude(_date, _dude);
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
    },

    garbageCollection: function(){
        for(v in App.views){
            var view = App.views[v];
            view.undelegateEvents();
            view.stopListening(Backbone);
            view.stopListening();
        }
    }


})
