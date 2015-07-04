var View     = require('./view')
  , template = require('../templates/index')

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template
})
