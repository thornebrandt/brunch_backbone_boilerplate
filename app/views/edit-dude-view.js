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
        'submit #newDudePhotoForm' : 'submitDudePhotoFormHandler',
        'click #dudeBtn' : 'clickDudeHandler',
        'click #dudesBtn' : 'clickDudesHandler',
        'click #deleteDudeBtn' : 'deleteDudeHandler'
    },

    afterRender: function(){
        this.setupDatePick();
        this.setupPhotoUploader();
        this.setupThumbUploader();
        this.setupDudePhotoUploader();
        this.setupPhotoPreview();
        this.setupDudePhotoPreview();
        this.setupThumbPreview();
    },
    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },

    showPreviewPhoto: function(source){
        $("#photoPreview").attr("src", source);
    },

    setupPhotoPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalPhoto = $("#photoPreview").attr("src");
        fileHelper.uploadImagePreview( $("#photoInput"), this.showPreviewPhoto, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewPhoto();
            }
        });
    },

    setupDudePhotoPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalDudePhoto = $("#dudePhotoPreview").attr("src");
        fileHelper.uploadImagePreview( $("#dudePhotoInput"), this.showPreviewDudePhoto, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewDudePhoto();
            }
        });
    },

    showPreviewDudePhoto: function(source){
        $("#dudePhotoPreview").attr("src", source);
    },

    revertPreviewDudePhoto: function(){
        $("#dudePhotoPreview").attr("src", this.originalDudePhoto);
    },

    revertPreviewImage: function(){
        $("#photoPreview").attr("src", this.originalPhoto);
    },


    showPreviewThumb: function(source){
        $("#thumbPreview").attr("src", source);
        $("#photoInputContainer").html("Only editing thumb");
    },

    setupThumbPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalThumb = $("#thumbPreview").attr("src");
        fileHelper.uploadImagePreview( $("#thumbInput"), this.showPreviewThumb, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewThumb();
            }
        });
    },

    revertPreviewThumb: function(){
        $("#thumbPreview").attr("src", this.originalThumb);
    },

    setupUploader: function($el){
        var _id = this.model.get("_id");
        var url = BASE_URL + "/dudes/edit/" + _id;
        var url = BASE_URL + "/dudes/edit/";
        var self = this;

        $el.fileupload({
            url: url,
            type: "PATCH",
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#dudeForm").serializeObject();
                    formObj._id = _id;
                    data.formData = formObj;
                    data.submit();
                });

            },
            done: function(e, data){
                self.navigateToDude(data.result);
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
            },
            error: function(e, textStatus, errorThrown){
                App.error("Something went wrong with uploading </br>" + e.responseText);
            }
        });
    },


    setupThumbUploader: function(){
        this.setupUploader($("#thumbInput"));
    },

    setupDudePhotoUploader: function(){
        var dude_id = this.model.get("_id");
        var url = BASE_URL + "/photos"
        var self = this;
        console.log("setting up dude photo uploader");
        $("#dudePhotoInput").fileupload({
            url: url,
            type: "POST",
            dataType: 'json',
            add: function(e, data){
                $("#upload_sub_photo").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#newDudePhotoForm").serializeObject();
                    formObj.dude_id = dude_id;
                    data.formData = formObj;
                    data.submit();
                });
            },
            done: function(e, data){
                self.navigateToDude(self.model.toJSON());
            },
            progressall: function(e, data){
            },
            error: function(e, textStatus, errorThrown){
                App.error("something went wrong with uploading </b>" + e.responseText);
            }
        });
    },




    setupPhotoUploader: function(){
        //mainphoto
        this.setupUploader($("#photoInput"));
    },

    deleteDudeHandler: function(e){
        e.preventDefault();
        var url = BASE_URL + "/dude";
        this.model.save(
            this.model.toJSON(),
            {
                url: url,
                type: 'DELETE'
            }
        ).then(
            function success(data){
                App.router.navigate("dudes", { trigger: true });
            },
            function error(e){
                console.log("error deleting");
                console.log(e.responseText);
            }
        );

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

    submitDudePhotoFormHandler: function(e){
        e.preventDefault();
        App.error("Must include a photo");
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
