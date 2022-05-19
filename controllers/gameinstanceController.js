const GameInstance = require('../models/gameinstance');
var async = require('async');

exports.gameinstance_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED: game instance LIST');
};

//Display detail specific Developer
exports.gameinstance_detail = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: game instance detail page')

  GameInstance.findById(req.params.id)
  .populate('game')
  .populate('platform')
  .exec(function (err, gameinstance) {
    if (err) {
      return next(err);
    }
    if (gameinstance === null) {
      let err = new Error('Game Instance Not Found')
      err.status = 404;
      return next(err);
    }
    //successful
    res.render('gameinstance_detail', {
      title: gameinstance.game.title,
      gameinstance: gameinstance,
    });
  });

}

exports.gameinstance_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get create game instance');
};

exports.gameinstance_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game instance');
};

exports.gameinstance_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get delete game instance');
};

exports.gameinstance_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post delete game instance');
};

exports.gameinstance_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: post update game instance');
};

exports.gameinstance_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update game instance');
};