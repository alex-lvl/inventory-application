const Developer = require('../models/developer');
const Game = require('../models/game')
var async = require('async');
const { body, validationResult } = require('express-validator');

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
  res.render('developer_form', {title: 'Create Developer', errors: false})
};

// exports.developer_create_post = function (req, res) {
//   res.send('NOT IMPLEMENTED: post create developer');
// };

exports.developer_create_post = [

  //validation and sanitization.
  body('name').trim().isLength({min: 1}).escape().withMessage('Developer name must be specified.').isAlphanumeric().withMessage('Developer Name has non-alphanumeric characters.'),
  body('weburl', 'invalid url').isURL().escape(),
  body('about').trim().isLength({min: 1}).escape().withMessage('About the developer must be specified.'),

  //Process request after validation and sanitization.
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //there are errors render form again
      res.render('developer_form', {title: 'Create Developer', developer: req.body, errors: errors.array() });
      return;
    } else {
      //data is valid

      //create new Developer
      var developer = new Developer({
        name: req.body.name,
        weburl: req.body.weburl,
        logo: '',
        about: req.body.about,
      });
      developer.save(function (err) {
        if (err) {
          return next(err)
        }
        //success
        console.log('New Developer ' + developer);
        res.redirect(developer.url);
      });
    }
  }

];

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