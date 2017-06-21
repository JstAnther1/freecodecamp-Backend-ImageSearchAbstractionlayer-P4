var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var ImgSchema = new Schema ({
    searchentry: String,
    searchdate: Date
},{timestamps: true}); 

module.exports = mongoose.model('ImgCollection', ImgSchema);