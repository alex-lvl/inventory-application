const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EsrbSchema = new Schema(
  {
    rating: {type: String, enum: ['E (Everyone)', 'E10+ (Everyone 10 And Up)', 'T (Teen)', 'M (Mature)','RP (Rating Pending)'], required: true},
    description: String,
  }
)

EsrbSchema
.virtual('url')
.get(function () {
  return '/catalog/esrb/' + this._id;
});

module.exports = mongoose.model('Esrb', EsrbSchema);
