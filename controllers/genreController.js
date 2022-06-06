const Genre = require('../models/genre');
const Game = require('../models/game');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.genre_list = function (req, res, next) {
  res.send('NOT IMPLEMENTED: genre LIST');
};

exports.genre_locals = function (req, res, next) {
  let errors;
  let genre;
  res.locals.genre = genre;
  res.locals.errors = errors;
  next();
};

//Display detail specific Developer
exports.genre_detail = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: genre detail page')

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_games: function (callback) {
        Game.find({ genre: req.params.id }, 'title description').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        let err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_games: results.genre_games,
      });
    }
  );
};

exports.genre_create_get = function (req, res) {
  res.render('genre_form', { title: 'Create New Genre' });
};

exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 2 }).escape(),
  body('description').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

exports.genre_delete_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: get delete genre');

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_games: function (callback) {
        Game.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        res.redirect('/catalog');
      }
      //success
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_games: results.genre_games,
      });
    }
  );
  
};

exports.genre_delete_post = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: post delete genre');

  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      genre_games: function (callback) {
        Game.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre_games.length > 0) {
        //success
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_games: results.genre_games,
        });
        return
      } else {
        Genre.findByIdAndRemove(req.body.genreid, function (err) {
          if (err) {
            return next(err);
          }
          //success
          res.redirect('/catalog');
        });
      }
    }
  );

  Genre.findById(req.params.id).exec(function (err, genre) {
    if (err) {
      return next(err);
    }

    //success
    Genre.findByIdAndRemove(req.body.genreid, function (err) {
      if (err) {
        return next(err);
      }
      //success
      res.redirect('/catalog');
    });
  });
};

exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get update genre');
};

exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post update genre');
};
