var View     = require('./view')
  , template = require('../templates/app')
  , jqueryHelper = require('../helpers/jqueryHelper');

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    template: template,
    initialize: function(){
        jqueryHelper.initialize();
    }
})
