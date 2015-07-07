// Base class for all views
module.exports = Backbone.View.extend({

    initialize: function(){
        this.render = _.bind(this.render, this);
    },

    template: function(){},
    getRenderData: function(){},
    beforeRender: function(){},
    render: function(){
        this.beforeRender();
        this.$el.html(this.template(this.getRenderData()))
        this.afterRender()
        return this
    },

    afterRender: function(){}

})
