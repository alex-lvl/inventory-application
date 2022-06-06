const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema(
  {
    name: {type: String, required: true},
    weburl: String,
    logo: String,
    about: String,
  }
);

DeveloperSchema
.virtual('url')
.get(function () {
  return '/catalog/developer/' + this._id;
});

DeveloperSchema
.virtual('formUrl')
.get(function () {
  return '/form/developer/' + this._id;
});

module.exports = mongoose.model('Developer', DeveloperSchema);
