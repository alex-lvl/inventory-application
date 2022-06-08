const Game = require('../models/game');
const Developer = require('../models/developer');
const Genre = require('../models/genre');
const GameInstance = require('../models/gameinstance');
const Platform = require('../models/platform');
const Esrb = require('../models/esrb');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.game_item = function (req, res, next) {
  let game;
  let errors;

  res.locals.game = game;
  res.locals.errors = errors;

  next();
};

exports.index = function (req, res) {
  async.parallel(
    {
      game_count: function (callback) {
        Game.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      game_instance_count: function (callback) {
        GameInstance.countDocuments({}, callback);
      },
      game_instance_available_count: function (callback) {
        GameInstance.countDocuments({ status: 'Available' }, callback);
      },
      developer_count: function (callback) {
        Developer.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
      esrb_rating: function (callback) {
        Esrb.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      developers: function (callback) {
        Developer.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      genres: function (callback) {
        Genre.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      platforms: function (callback) {
        Platform.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Rent-A-Game!',
        esrb_title: 'ESRB',
        developer_title: 'Developer',
        genre_title: 'Genre',
        platform_title: 'Platform',
        error: err,
        data: results,
      });
    }
  );
};

//Display list of games
exports.game_list = function (req, res, next) {
  async.parallel(
    {
      list_games: function (callback) {
        Game.find({}, callback);
      },
      esrb_rating: function (callback) {
        Esrb.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      developers: function (callback) {
        Developer.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      genres: function (callback) {
        Genre.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      platforms: function (callback) {
        Platform.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
    },
    function (err, results) {
      res.render('game_list', {
        title: 'Games',
        esrb_title: 'ESRB',
        developer_title: 'Developer',
        genre_title: 'Genre',
        platform_title: 'Platform',
        games_list: results.list_games,
        error: err,
        data: results,
      });
    }
  );
};

//Display game detail

exports.game_detail = function (req, res, next) {
  async.parallel(
    {
      game: function (callback) {
        Game.findById(req.params.id)
          .populate('developer')
          .populate('genre')
          .exec(callback);
      },
      game_instances: function (callback) {
        GameInstance.find({ game: req.params.id })
          .populate('game')
          .populate('platform')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.game === null) {
        let err = new Error('Game not found');
        err.status = 404;
        return next(err);
      }
      res.render('game_detail', {
        title: results.game.title,
        game: results.game,
        game_instance: results.game_instances,
      });
    }
  );
};

exports.game_create_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: get create game');
  async.parallel(
    {
      developers: function (callback) {
        Developer.find(callback);
      },
      esrb_ratings: function (callback) {
        Esrb.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      //success
      res.render('game_form', {
        title: 'Create New Game',
        developers: results.developers,
        esrb_ratings: results.esrb_ratings,
        genres: results.genres,
      });
    }
  );
};

exports.game_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  //validation and sanitization.
  body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
  body('developer', 'Developer required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price required')
    .trim()
    .isFloat()
    .withMessage('Numeric value required in price')
    .isDecimal({ decimal_digits: '2', force_decimal: true })
    .withMessage('Two decimal digits required in price')
    .escape(),
  body('esrb_rating').trim().isLength({ min: 1 }).escape(),

  //Process request after validation and sanitization.
  function (req, res, next) {
    const errors = validationResult(req);

    //create new Developer
    var game = new Game({
      title: req.body.title,
      developer: req.body.developer,
      description: req.body.description,
      price: req.body.price,
      esrb: req.body.esrb_rating,
      genre: req.body.genre,
      quantity: '',
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          developers: function (callback) {
            Developer.find(callback);
          },
          esrb_ratings: function (callback) {
            Esrb.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          //errors found rerender form
          res.render('game_form', {
            title: 'Create New Game',
            game: game,
            developers: results.developers,
            esrb_ratings: results.esrb_ratings,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      //data is valid
      game.save(function (err) {
        if (err) {
          return next(err);
        }
        //success
        console.log('New Game ' + game);
        res.redirect(game.url);
      });
    }
  },
];

exports.game_delete_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: post create game');

  async.parallel(
    {
      game: function (callback) {
        Game.findById(req.params.id)
          .populate('developer')
          .populate('genre')
          .exec(callback);
      },
      game_instances: function (callback) {
        GameInstance.find({ game: req.params.id })
          .populate('game')
          .populate('platform')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.game === null) {
        res.redirect('/catalog/games');
      }
      res.render('game_delete', {
        title: 'Delete Game',
        game: results.game,
        game_instance: results.game_instances,
      });
    }
  );
};

exports.game_delete_post = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: post create game');
  async.parallel(
    {
      game: function (callback) {
        Game.findById(req.body.gameid)
          .populate('developer')
          .populate('genre')
          .exec(callback);
      },
      game_instances: function (callback) {
        GameInstance.find({ game: req.body.gameid })
          .populate('game')
          .populate('platform')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.game_instances > 0) {
        res.render('game_delete', {
          title: 'Delete Game',
          game: results.game,
          game_instance: results.game_instances,
        });
        return;
      } else {
        Game.findByIdAndRemove(req.body.gameid, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog/games');
        });
      }
    }
  );
};

exports.game_update_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: post create game');

  async.parallel(
    {
      game: function (callback) {
        Game.findById(req.params.id)
          .populate('developer')
          .populate('genre')
          .exec(callback);
      },
      developers: function (callback) {
        Developer.find(callback);
      },
      esrb_ratings: function (callback) {
        Esrb.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.game === null) {
        let err = new Error('game not found');
        err.status = 404;
        return next(err);
      }
      //errors found rerender form
      res.render('game_form', {
        title: 'Update Game',
        game: results.game,
        developers: results.developers,
        esrb_ratings: results.esrb_ratings,
        genres: results.genres,
      });
    }
  );
};

exports.game_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  //validation and sanitization.
  body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
  body('developer', 'Developer required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price required')
    .trim()
    .isFloat()
    .withMessage('Numeric value required in price')
    .isDecimal({ decimal_digits: '2', force_decimal: true })
    .withMessage('Two decimal digits required in price')
    .escape(),
  body('esrb_rating').trim().isLength({ min: 1 }).escape(),

  //Process request after validation and sanitization.
  function (req, res, next) {
    const errors = validationResult(req);

    //create new Developer
    var game = new Game({
      _id: req.params.id,
      title: req.body.title,
      developer: req.body.developer,
      description: req.body.description,
      price: req.body.price,
      esrb: req.body.esrb_rating,
      genre: req.body.genre,
      quantity: '',
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          developers: function (callback) {
            Developer.find(callback);
          },
          esrb_ratings: function (callback) {
            Esrb.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          //errors found rerender form
          res.render('game_form', {
            title: 'Update Game',
            game: req.body,
            developers: results.developers,
            esrb_ratings: results.esrb_ratings,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      //data is valid
      Game.findByIdAndUpdate(req.params.id, game, {}, function (err, thegame) {
        if (err) {
          return next(err);
        }
        //success
        res.redirect(thegame.url);
      });
    }
  },
];
