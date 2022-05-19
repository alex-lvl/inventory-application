const Developer = require('../models/developer');
const Game = require('../models/game')
var async = require('async');

//Display all authors
exports.developer_list = function(req, res, next) {

  Developer.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_developers) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('developer_list', { title: 'Developer List', developer_list: list_developers });
    });

};

//Display detail specific Developer
exports.developer_detail = function(req, res, next) {

  async.parallel({
    developer: function(callback) {
      Developer.findById(req.params.id)
      .exec(callback);
    },
    developer_games: function(callback){
      Game.find({developer: req.params.id}, 'title description')
      .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.developer === null) {
      let err = new Error('Developer not found');
      err.status = 404;
      return next(err);
    }
    //success
    res.render('developer_detail', {title: 'Developer Detail', developer: results.developer, developer_games: results.developer_games});
  });
  
}

exports.developer_create_get = function (req, res) {
  res.render('developer_form', {title: 'Create Developer'})
};

exports.developer_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create developer');
};

exports.developer_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get delete developer');
};

exports.developer_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post delete developer');
};

exports.developer_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get update developer');
};

exports.developer_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update developer');
};