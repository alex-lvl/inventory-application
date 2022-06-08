const Esrb = require('../models/esrb');
const Game = require('../models/game');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.esrb_list = function (req, res, next) {
  res.send('NOT IMPLEMENTED: ESRB LIST');
};

exports.esrb_locals = function (req, res, next) {
  let errors;
  let esrb;
  let updateUrl;
  let deleteUrl;
  res.locals.esrb = esrb;
  res.locals.updateUrl = updateUrl;
  res.locals.deleteUrl = deleteUrl;
  res.locals.errors = errors;
  next();
};

//Display detail specific Developer
exports.esrb_detail = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: esrb detail page');

  async.parallel(
    {
      esrb: function (callback) {
        Esrb.findById(req.params.id).exec(callback);
      },
      esrb_games: function (callback) {
        Game.find({ esrb: req.params.id }, 'title description').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.esrb === null) {
        let err = new Error('Esrb not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('esrb_detail', {
        title: 'Esrb Detail',
        esrb: results.esrb,
        esrb_games: results.esrb_games,
      });
    }
  );
};

exports.esrb_create_get = function (req, res) {
  // res.send('NOT IMPLEMENTED: get create esrb');
  res.render('esrb_form', { title: 'Create New ESRB' });
};

exports.esrb_create_post = [
  // Validate and sanitize the name field.
  body('rating').escape(),
  body('description').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var esrb = new Esrb({
      rating: req.body.rating,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('esrb_form', {
        title: 'Create New ESRB',
        esrb: esrb,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Esrb.findOne({ rating: req.body.name }).exec(function (
        err,
        found_rating
      ) {
        if (err) {
          return next(err);
        }

        if (found_rating) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_rating.url);
        } else {
          Esrb.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(esrb.url);
          });
        }
      });
    }
  },
];
// exports.esrb_create_post = function (req, res) {
//   res.send('NOT IMPLEMENTED: post create esrb');
// };

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
