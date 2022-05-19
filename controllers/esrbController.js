const Esrb = require('../models/esrb');
const Game = require('../models/game');
var async = require('async');

exports.esrb_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED: ESRB LIST');
};

//Display detail specific Developer
exports.esrb_detail = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: esrb detail page');

  async.parallel({
    esrb: function(callback) {
      Esrb.findById(req.params.id)
      .exec(callback);
    },
    esrb_games: function(callback){
      Game.find({esrb: req.params.id}, 'title description')
      .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.esrb === null) {
      let err = new Error('Esrb not found');
      err.status = 404;
      return next(err);
    }
    //success
    res.render('esrb_detail', {title: 'Esrb Detail', esrb: results.esrb, esrb_games: results.esrb_games});
  });

}

exports.esrb_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get create esrb');
};

exports.esrb_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create esrb');
};

exports.esrb_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: post create esrb');
};

exports.esrb_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create esrb');
};

exports.esrb_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: post create esrb');
};

exports.esrb_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create esrb');
};