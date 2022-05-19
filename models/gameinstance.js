const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema(
  {
    game: {type: Schema.Types.ObjectId, ref: 'Game', required: true},
    platform: {type: Schema.Types.ObjectId, ref: 'Platform', required: true},
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
)

GameInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/gameinstance/' + this._id;
});

GameInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  return this.due_back.toDateString();
});

module.exports = mongoose.model('GameInstance', GameInstanceSchema);
