var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/new-dude-template');
var DudeModel = require('../models/dude-model');
var dateHelper = require('../helpers/dateHelper');


module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    events: {
        'submit #dudeForm' : 'submitDudeFormHandler',
    },
    afterRender: function(){
        this.setupDatePick();
    },
    submitDudeFormHandler: function(e){
        e.preventDefault();
        //console.log( $(e.target).serializeObject() );
        this.model = new DudeModel( $(e.target).serializeObject() );
        console.log("sending this model");
        console.log(this.model);
        this.model.save().then(
            function succes(data){
                console.log("success");
                console.log(data);
                App.router.navigate("/dudes", { trigger: true });

            },
            function error(err){
                console.log("Error");
                console.log(err);
            }
        );
    },
    setupDatePick: function(){
        $("#inlineDatePicker").datepick({
            onSelect: function(date){
                var dateMoment = new moment(date[0]);
                console.log(dateMoment.format(dateHelper.UTC_format));
                $("#dateInput").val(date);
            },
        });
    }
})
