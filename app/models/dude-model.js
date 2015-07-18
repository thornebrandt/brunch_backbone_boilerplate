var dateHelper = require('../helpers/dateHelper');

module.exports = Backbone.Model.extend({
    //url: BASE_URL + "/dudes/new",
    url: BASE_URL + "/api/photo",
    formatDate: function(){
        var modelDate = new moment(this.get("date"), dateHelper.UTC_format);
        this.set("formattedDate", modelDate.format(dateHelper.upcoming_format));
    }
});
