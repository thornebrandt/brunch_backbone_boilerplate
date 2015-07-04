var View     = require('./view')
  , template = require('../templates/app')

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    template: template
})
