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
        this.setupUploader();
    },

    setupUploader: function(){
        var url = BASE_URL + "/api/photo"

        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            add: function(e, data){
                console.log("removing default behavior");
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    data.submit();
                });
            },
            done: function(e, data){
                console.log(data);
                var absolute_image_path = data.result.files.photo.path;
                var image_path = absolute_image_path.replace("public", "");
                $("#uploadedImage").attr("src", image_path);

            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
                // $('#progress .progress-bar').css(
                //     'width',
                //     progress + '%'
                // );
            },
            fail: function(e, data){
                console.log("fail");
                console.log(e);
                console.log(data);
            }
        });
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
