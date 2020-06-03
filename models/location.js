let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
const Location = new Schema({
  locationimage: {data: Buffer, contentType: String},
  title: { type: String, required: true },
  description: { type: String, required: true },

});



module.exports = mongoose.model('Location', Location);
  
  