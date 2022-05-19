const Genre = require('../models/genre');
const Game = require('../models/game')
var async = require('async');

exports.genre_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED: genre LIST');
};

//Display detail specific Developer
exports.genre_detail = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: genre detail page')

  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
      .exec(callback);
    },
    genre_games: function(callback){
      Game.find({genre: req.params.id}, 'title description')
      .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre === null) {
      let err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    //success
    res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_games: results.genre_games});
  });

}

exports.genre_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get create genre');
};

exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create genre');
};

exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get delete genre');
};

exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post delete genre');
};

exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get update genre');
};

exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update genre');
};