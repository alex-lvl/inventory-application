const Platform = require('../models/platform');
const Game = require('../models/game');
var async = require('async');

exports.platform_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED: platform LIST');
};

//Display detail specific Developer
exports.platform_detail = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: platform detail page')

  async.parallel({
    platform: function(callback) {
      Platform.findById(req.params.id)
      .exec(callback);
    },
    platform_games: function(callback){
      Game.find({platform: req.params.id}, 'title description')
      .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.platform === null) {
      let err = new Error('Platform not found');
      err.status = 404;
      return next(err);
    }
    //success
    res.render('platform_detail', {title: 'Platform Detail', platform: results.platform, platform_games: results.platform_games});
  });

}

exports.platform_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get create platform');
};

exports.platform_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create platform');
};

exports.platform_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get delete platform');
};

exports.platform_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post delete platform');
};

exports.platform_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get update platform');
};

exports.platform_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update platform');
};