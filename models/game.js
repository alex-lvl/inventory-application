const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    title: {type: String, required: true},
    developer: {type: Schema.Types.ObjectId, ref: 'Developer', required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    esrb: {type: Schema.Types.ObjectId, ref: 'Esrb', required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre', required: true}],
    quantity: Number
  }
)

GameSchema
.virtual('url')
.get(function () {
  return '/catalog/game/' + this._id;
});

GameSchema
.virtual('formUrl')
.get(function () {
  return '/form/game/' + this._id;
});

module.exports = mongoose.model('Game', GameSchema);
