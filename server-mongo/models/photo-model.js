var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var currentDate = new Date();

var photoSchema = new mongoose.Schema({
    dude_id: String,
    caption: String,
    photo: String,
    thumb: String,
    created_at: Date,
    updated_at: Date
},
{
    collection: 'photos'
});

photoSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


module.exports = mongoose.model('PhotoModel', photoSchema);
