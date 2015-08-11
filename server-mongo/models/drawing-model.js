var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var currentDate = new Date();

var drawingSchema = new mongoose.Schema({
    drawing: String,
    created_at: Date,
    updated_at: Date
},
{
    collection: 'drawings'
});

drawingSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


module.exports = mongoose.model('DrawingModel', drawingSchema);
