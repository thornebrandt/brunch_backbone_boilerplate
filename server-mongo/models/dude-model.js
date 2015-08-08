var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testSchema = new mongoose.Schema({
    dude: String,
    greeting: String,
    date: Date,
    photo: String,
    thumb: String
},
{
    collection: 'testCollection'
});

testSchema.index({ dude: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('TestModel', testSchema);
