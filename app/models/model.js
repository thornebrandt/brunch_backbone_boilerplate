module.exports = Backbone.Model.extend({
    //url: BASE_URL + "/dudes/new",
    initialize: function(){
        this.authorize();
    },
    authorize: function(){
        if(App.authorized){
            this.set("authorized", true);
        }
    }
});
