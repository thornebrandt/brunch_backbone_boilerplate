module.exports = function(){
    var self = this;
    var max_file_size = max_file_size || 5000000;


    this.uploadImagePreview = function(_input, handler, options) {
        //input : file input that holds image
        //btn :  ok.
        //handler : what happens after upload.  source is the image src
        //options.onError = callback.
        options = options || {};

        function showUploadedItem(source){
            handler(source);
        }

        _input.change( function(evt) {
            var i = 0,
                len = this.files.length,
                img, reader, file;

            for (i; i < len; i++) {
                file = this.files[i];

                if (!!file.type.match(/image.*/)) {
                    if (window.FileReader) {
                        reader = new FileReader();
                        reader.onloadend = function(e) {
                            showUploadedItem(e.target.result, file.fileName);
                            var file_size = file.size;
                            console.log(file.name + " - " + file.type + " - " + self.formatSizeUnits(file.size));
                        };
                        reader.readAsDataURL(file);
                    }
                    if (typeof formdata !== "undefined" && formdata) {
                        formdata.append("images[]", file);
                    }
                } else {
                    if(typeof options.onError === "function"){
                        options.onError("That was not an image");
                    } else {
                        self.errorHandler("That was not an image");
                    }
                }
            }
        });
    };

    this.errorHandler = function(errorMessage){
        alert(errorMessage);
    };

    this.checkFileSize = function(_filesize){
        var _units = self.formatSizeUnits(_filesize);
        if (_filesize > max_file_size){
            return false;
            // $("#confirm_image").hide();
            $("#response").html("<span class='error'>Your file is big. ("
                +_units+"). This might take a while.</span>");
        } else {
            $("#response").html("Your file is " + _units);
        }
    };


    this.formatSizeUnits = function(bytes){
          if      (bytes>=1073741824) {bytes=(bytes/1073741824).toFixed(2)+' GB';}
          else if (bytes>=1048576)    {bytes=(bytes/1048576).toFixed(2)+' MB';}
          else if (bytes>=1024)       {bytes=(bytes/1024).toFixed(2)+' KB';}
          else if (bytes>1)           {bytes=bytes+' bytes';}
          else if (bytes==1)          {bytes=bytes+' byte';}
          else                        {bytes='0 byte';}
          return bytes;
    };

};