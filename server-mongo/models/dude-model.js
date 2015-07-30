var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testSchema = new mongoose.Schema({
    dude: String,
    greeting: String,
    date: Date,
    photo: String
},
{
    collection: 'testCollection'
});


module.exports = mongoose.model('TestModel', testSchema);
