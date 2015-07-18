var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/new-dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');


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
        this.model = new DudeModel( $(e.target).serializeObject() );
        var $form = $(e.target);
        var fileInput = $("#photoInput");

        var url = BASE_URL + "/api/photo"
        var values = {};
        _.each($form.serializeArray(), function(input){
            values[ input.name ] = input.value;
        });

        this.model.save(values, {
            iframe: true,
            files: fileInput,
            data: values,
            processData: false
        });

        $('#fileupload').fileupload({
                url: url,
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo('#files');
                    });
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                }
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');



        // $.ajax(url, { //works
        //     files: $("#photoInput"),
        //     iframe: true,
        //     method: "post",
        //     type: "POST",
        // }).complete(function(data){
        //     console.log(data);
        // });




        // this.model.save({
        //     iframe: true,
        //     type: "POST",
        //     files: fileInput,
        // });

        // this.model.save().then(
        //     function succes(data){
        //         console.log("success");
        //         console.log(data);
        //         App.router.navigate("/dudes", { trigger: true });

        //     },
        //     function error(err){
        //         console.log("Error");
        //         console.log(err);
        //     }
        // );
    },
    setupDatePick: function(){
        $("#inlineDatePicker").datepicker({
            onSelect: function(date){
                var dateMoment = new moment(date, time.datepicker_format);
                $("#dateInput").val(date);
            },
        });
    }
})
