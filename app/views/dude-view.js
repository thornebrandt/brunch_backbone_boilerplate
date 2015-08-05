var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    // afterRender: function(){
    //     this.findDude();
    // },
    events: {
        'click #backToDudes' : 'backToDudesHandler',
        'click #editDudeBtn' : 'clickEditDudeHandler'
    },
    getRenderData: function(){
        return this.model.toJSON();
    },

    fetchDude: function(_date, _dude){
        var self = this;
        this.URLdate = _date;
        this.dude = _dude;
        this.date = new moment(this.URLdate, time.url_format).format(time.UTC_format);
        var url = BASE_URL + "/dude/" + this.date + "/" + this.dude;
        this.model = new DudeModel();
        this.model.fetch({
            url: url,
            success: function(data){
                self.model.formatDate();
                self.render();
            },
            error: function(model, response){
                console.log("something went wrong getting a specific dude");
                console.log(response);
            }
        });
    },

    backToDudesHandler: function(e){
        e.preventDefault();
        App.router.navigate("/dudes/", { trigger: true });
    },

    clickEditDudeHandler: function(e){
        e.preventDefault();
        var url = "/dudes/" + this.URLdate + "/" + this.dude  + "/edit"
        App.router.navigate(url, { trigger: true });
    },

})
