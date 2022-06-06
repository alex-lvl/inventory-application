const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema(
  {
    name: {type: String, required: true, maxlength:100, minlength:2},
    description: String,
  }
)

GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

GenreSchema
.virtual('formUrl')
.get(function () {
  return '/form/genre/' + this._id;
});

module.exports = mongoose.model('Genre', GenreSchema);
