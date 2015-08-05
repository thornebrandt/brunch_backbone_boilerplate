var View     = require('./view');
var DudePreviewView = require('../views/dude-preview-view');
var template = require('../templates/edit-dude-template');
var DudeModel = require('../models/dude-model');
var time = require('../helpers/dateHelper');
var FileHelper = require('../helpers/fileHelper');

module.exports = View.extend({
    el: "#main",
    id: 'index-view',
    template: template,
    events: {
        'submit #dudeForm' : 'submitDudeFormHandler',
        'click #dudeBtn' : 'clickDudeHandler',
        'click #dudesBtn' : 'clickDudesHandler'
    },

    afterRender: function(){
        this.setupDatePick();
        this.setupUploader();
        this.setupImagePreview();
    },
    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },
    showPreviewImage: function(source) {
        $("#imagePreview").attr("src", source);
    },

    setupImagePreview: function(){
        var fileHelper = new FileHelper();
        fileHelper.uploadImagePreview( $("#fileupload"), this.showPreviewImage);
    },

    setupUploader: function(){
        //need this in addition to the submit dude handler
        var _id = this.model.get("_id");
        var url = BASE_URL + "/dudes/edit/" + _id;
        var url = BASE_URL + "/dudes/edit/";
        var self = this;

        $('#fileupload').fileupload({
            url: url,
            type: "PATCH",
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#dudeForm").serializeObject()
                    formObj._id = _id;
                    data.formData = formObj;
                    data.submit();
                });

            },
            done: function(e, data){
                console.log(data.result);
                self.navigateToDude(data.result);
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
            },
            fail: function(e, data){
                console.log("fail");
                console.log(e);
                console.log(data);
            },
        });
    },


    submitDudeFormHandler: function(e){
        e.preventDefault();
        var self = this;
        var _id = this.model.get("_id");
        this.model = new DudeModel( $(e.target).serializeObject() );
        this.model.set("_id", _id);

        var url = BASE_URL + "/dudes/edit";
        this.model.save(
            this.model.toJSON(),
            {
                patch: true,
                url: url,
                type: 'PATCH'
            }
        ).then(
            function success(data){
                self.navigateToDude(data);
            },
            function error(e){
                console.log("error patching");
                console.log(e.responseText);
            }
        );

        var $form = $(e.target);
        var $fileInput = $("#fileupload");
        console.log(this.model);
    },


    setupDatePick: function(){
        var $dateInput = $("#dateInput");
        var $datePicker = $("#inlineDatePicker");
        var savedDate = new moment($dateInput.val(), time.datepicker_format).toDate();
        $datePicker.datepicker({
            onSelect: function(date){
                var ISO_date = new moment(date, time.datepicker_format).format();
                $dateInput.val(ISO_date);
            },
        });
        $datePicker.datepicker('setDate', savedDate);
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
                self.render();
            },
            error: function(model, response){
                console.log("something went wrong getting a specific dude");
                console.log(response);
            }
        });
    },

    clickDudeHandler: function(e){
        e.preventDefault();
        var url = "/dudes/" + this.URLdate + "/" + this.dude;
        App.router.navigate(url, { trigger: true });
    },

    navigateToDude: function(_model){
        var dudeModel = new DudeModel(_model);
        dudeModel.formatDate();
        var url = "/dudes/" + dudeModel.get("URLdate") + "/" + dudeModel.get("dude");
        App.router.navigate(url, { trigger: true });
    },

    clickDudesHandler: function(e){
        e.preventDefault();
        App.router.navigate("/dudes/", { trigger: true });
    }



})
