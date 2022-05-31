const GameInstance = require('../models/gameinstance');
const Game = require('../models/game');
const Platform = require('../models/platform');
const { body, validationResult } = require('express-validator');
var async = require('async');

exports.gameinstance_locals = function(req,res,next) {
  let errors;
  let gameinstance;
  res.locals.gameinstance = gameinstance;
  res.locals.errors = errors;
  next();
}

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

exports.gameinstance_create_get = function (req, res, next) {
  // res.send('NOT IMPLEMENTED: get create game instance');
  async.parallel({
    games: function(callback) {
      Game.find(callback);
    },
    platforms: function(callback) {
      Platform.find(callback);
    }
  },
  function(err, results) {
    if (err) {
      return next(err);
    } else {
      res.render('gameinstance_form', {
        title: 'Create New Game Instance',
        games: results.games,
        platforms: results.platforms,
      });
    }
  }
  );

};

exports.gameinstance_create_post = [
  // Convert the genre to an array.
  // (req, res, next) => {
  //   if (!(req.body.genre instanceof Array)) {
  //     if (typeof req.body.genre === 'undefined') req.body.genre = [];
  //     else req.body.genre = new Array(req.body.genre);
  //   }
  //   next();
  // },

  //validation and sanitization.
  body('game', 'game required').trim().isLength({ min: 1 }).escape(),
  body('platform', 'platform required').trim().isLength( {min: 1} ).escape(),
  body('imprint', 'imprint required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status', 'status required')
    .trim()
    .escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  //Process request after validation and sanitization.
  function (req, res, next) {
    const errors = validationResult(req);

    //create new Developer
    var gameinstance = new GameInstance({
      game: req.body.game,
      platform: req.body.platform,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      async.parallel({
        games: function(callback) {
          Game.find(callback);
        },
        platforms: function(callback) {
          Platform.find(callback);
        }
      },
      function(err, results) {
        if (err) {
          return next(err);
        } else {
          res.render('gameinstance_form', {
            title: 'Create New Game Instance',
            gameinstance: gameinstance,
            games: results.games,
            selected_game: gameinstance.game._id,
            platforms: results.platforms,
            selected_platform: gameinstance.platform._id,
            errors: errors.array(),
          });
        }
      }
      );
      return;
    } else {
      //data is valid
      gameinstance.save(function (err) {
        if (err) {
          return next(err);
        }
        //success
        console.log('New Game Instance ' + gameinstance);
        res.redirect(gameinstance.url);
      });
    }
  },
];

// exports.gameinstance_create_post = function (req, res) {
//   res.send('NOT IMPLEMENTED: post create game instance');
// };

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