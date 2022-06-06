const Platform = require('../models/platform');
const Game = require('../models/game');
const GameInstance = require('../models/gameinstance');
var async = require('async');
const { body, validationResult } = require('express-validator');
const gameinstance = require('../models/gameinstance');

exports.platform_locals = function (req, res, next) {
  let errors;
  let platform;
  res.locals.platform = platform;
  res.locals.errors = errors;
  next();
};

exports.platform_list = function (req, res, next) {
  res.send('NOT IMPLEMENTED: platform LIST');
};

//Display detail specific Developer
exports.platform_detail = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: platform detail page')

  async.parallel(
    {
      platform: function (callback) {
        Platform.findById(req.params.id).exec(callback);
      },
      platform_games: function (callback) {
        GameInstance.find({ platform: req.params.id })
          .populate('game')
          .populate('platform')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.platform === null) {
        let err = new Error('Platform not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('platform_detail', {
        title: 'Platform Detail',
        platform: results.platform,
        platform_games: results.platform_games,
      });
    }
  );
};

exports.platform_create_get = function (req, res) {
  res.render('platform_form', { title: 'Create New Platform' });
};

exports.platform_create_post = [
  // Validate and sanitize the name field.
  body('console', 'console required').trim().isLength({ min: 1 }).escape(),
  body('description').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var platform = new Platform({
      console: req.body.console,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('platform_form', {
        title: 'Create New Platform',
        platform: platform,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if platform with same console already exists.
      Platform.findOne({ console: req.body.console }).exec(function (
        err,
        found_console
      ) {
        if (err) {
          return next(err);
        }

        if (found_console) {
          // console exists, redirect to its detail page.
          res.redirect(found_console.url);
        } else {
          platform.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(platform.url);
          });
        }
      });
    }
  },
];
// exports.platform_create_post = function (req, res) {
//   res.send('NOT IMPLEMENTED: post create platform');
// };

exports.platform_delete_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: get delete platform');

  async.parallel(
    {
      platform: function (callback) {
        Platform.findById(req.params.id).exec(callback);
      },
      platform_gameinstances: function (callback) {
        GameInstance.find({ platform: req.params.id })
          .populate('game')
          .populate('platform')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.platform === null) {
        res.redirect('/catalog');
      }
      res.render('platform_delete', {
        title: 'Platform Delete',
        platform: results.platform,
        platform_gameinstances: results.platform_gameinstances,
      });
    }
  );

  // Platform.findById(req.params.id).exec(function (err, platform) {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (platform == null) {
  //     res.redirect('/catalog');
  //   }
  //   res.render('platform_delete', {
  //     title: 'Delete Platform',
  //     platform: platform,
  //   });
  // });
};

exports.platform_delete_post = function (req, res, next) {
  async.parallel(
    {
      platform: function (callback) {
        Platform.findById(req.body.platformid).exec(callback);
      },
      platform_gameinstances: function (callback) {
        GameInstance.find({ platform: req.body.platformid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (platform_gameinstances.length > 0) {
        res.render('platform_delete', {
          title: 'Platform Delete',
          platform: results.platform,
          platform_gameinstances: results.platform_gameinstances,
        });
      } else {
        Platform.findByIdAndRemove(req.body.platformid, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog');
        });
      }
    }
  );

  // Platform.findById(req.params.id).exec(function (err, platform) {
  //   if (err) {
  //     return next(err);
  //   }
  //   Platform.findByIdAndRemove(req.body.platformid, function (err) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.redirect('/catalog');
  //   });
  // });
};

exports.platform_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get update platform');
};

exports.platform_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update platform');
};
