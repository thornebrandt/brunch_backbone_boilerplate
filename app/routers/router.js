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
        'login/:password': 'loginRoute',
        'logout' : 'logoutRoute',
        '*path' : 'defaultRoute',
    },

    defaultRoute: function(){
        this.index();
    },

    loginRoute: function(_password){
        //$.cookie('password', md5(_password), { expires: 7, path: '/' });
        window.localStorage.setItem('password', md5(_password));
        App.authorized = true;
        this.setupAjax();
        this.navigate("dudes", {trigger: true, replace: true })
    },

    logoutRoute: function(){
        console.log("removing password");
        //$.removeCookie('password');
        window.localStorage.removeItem('password');
        App.authorized = false;
        this.setupAjax();
        this.navigate("/", { trigger: true, replace: true });
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
        if(App.authorized){
            App.views.editDudeView = new App.Views.EditDudeView();
            App.views.editDudeView.fetchDude(_date, _dude);
        } else {
            App.error("Not authorized to edit");
            this.navigate("/", { trigger: true, replace: true });
        }
    },


    dudes: function(){
        this.loadApp();
        App.views.dudesView = new App.Views.DudesView();
        App.views.dudesView.render();
    },

    newDude: function(){
        this.loadApp();
        if(App.authorized){
            App.views.newDudeView = new App.Views.NewDudeView();
            App.views.newDudeView.render();
        } else {
            App.error("Not authorized to create new dudes");
            this.navigate("/", { trigger: true, replace: true });
        }
    },


    setupAjax: function(){
        var password = window.localStorage.getItem('password');
        $.ajaxSetup({
            headers: { 'password' : password },
            crossDomain: true,
            statusCode: {
                401: function(e){
                    Backbone.trigger("Unauthorized");
                }
            }
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
