var View     = require('./view');
module.exports = View.extend({
    initialize: function(model){
        this.render = _.bind(this.render, this);
        this.model = model
    },
    render: function(){
        this.beforeRender();
        this.$el.html(this.template(this.getRenderData()))
        this.afterRender();
        return this
    },
    beforeRender: function(){
        this.$el = $("#" + this.model.get("_id"));
        this.undelegateEvents();
        this.delegateEvents();
    },
    getRenderData: function(){
        return this.model.toJSON();
    }
});