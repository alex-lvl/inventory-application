const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlatformSchema = new Schema(
  {
    console: {type: String, required: true, maxlength: 50, minlength: 1},
    description: String,
  }
);

PlatformSchema
.virtual('url')
.get(function () {
  return '/catalog/platform/' + this._id;
});

PlatformSchema
.virtual('formUrl')
.get(function () {
  return '/form/platform/' + this._id;
});

module.exports = mongoose.model('Platform', PlatformSchema);
