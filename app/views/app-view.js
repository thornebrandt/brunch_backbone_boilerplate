var View     = require('./view')
  , template = require('../templates/app-template')
  , jqueryHelper = require('../helpers/jqueryHelper');

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    template: template,
    events: {
        "click #newDudeBtn" : "newDudeBtnHandler",
        "click #allDudesBtn" : "allDudesBtnHandler",
        "click #homeBtn" : "homeBtnHandler"
    },

    initialize: function(){
        jqueryHelper.initialize();
    },

    newDudeBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("dudes/new", { trigger: true });
    },

    allDudesBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("dudes", { trigger: true });
    },

    homeBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("home", { trigger: true });
    }

})
