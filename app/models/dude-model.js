var dateHelper = require('../helpers/dateHelper');

module.exports = Backbone.Model.extend({
    formatDate: function(){
        var modelDate = new moment(this.get("date"), dateHelper.UTC_format);
        this.set("formattedDate", modelDate.format(dateHelper.upcoming_format));
    }
});
