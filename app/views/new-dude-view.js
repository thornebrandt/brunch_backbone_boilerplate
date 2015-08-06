var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/new-dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');
var FileHelper = require('../helpers/fileHelper');

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
        this.setupImagePreview();
    },

    showPreviewImage: function(source) {
        $("#imagePreview").attr("src", source);
    },

    setupImagePreview: function(){
        var fileHelper = new FileHelper();
        fileHelper.uploadImagePreview( $("#fileupload"), this.showPreviewImage);
    },

    setupUploader: function(){
        var url = BASE_URL + "/dudes/new"

        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    data.submit();
                });
            },
            done: function(e, data){
                console.log(data.result);
                var image_path = data.result.photo;
                var dude = data.result.dude;
                var date = new moment(data.result.date, time.UTC_format).format(time.url_format);
                var url = "/dudes/" + date + "/" + dude;
                App.router.navigate(url, { trigger: true });
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
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

    },

    setupDatePick: function(){
        var $dateInput = $("#dateInput");
        var today = new moment().format(time.datepicker_format);
        $dateInput.val(today);

        $("#inlineDatePicker").datepicker({
            onSelect: function(date){
                $dateInput.val(date);
            },
        });
    }
})
