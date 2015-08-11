var DrawingModel = require("../models/drawing-model");
module.exports = Backbone.Collection.extend({
    url: BASE_URL + "/drawings",
    model: DrawingModel,
});