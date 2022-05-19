const Game = require('../models/game');
const Developer = require('../models/developer');
const Genre = require('../models/genre');
const GameInstance = require('../models/gameinstance');
const Platform = require('../models/platform');
const Esrb = require('../models/esrb');
var async = require('async');

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

// exports.catalog_list = function(req,res,next) {
//   async.parallel(
//     {
//       esrb_rating: function (callback) {
//         Esrb.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
//       },
//       developers: function (callback) {
//         Developer.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
//       },
//       genres: function (callback) {
//         Genre.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
//       },
//       platforms: function (callback) {
//         Platform.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
//       },
//     },
//     function (err, results) {
//       res.render('catalog', {
//         title: 'Categories',
//         esrb_title: 'ESRB',
//         developer_title: 'Developer',
//         genre_title: 'Genre',
//         platform_title: 'Platform',
//         error: err,
//         data: results,
//       });
//     }
//   );
// }

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
        data: results
      });
    }
  );

  // Game.find({}, 'title developer')
  //   .sort({ title: 1 })
  //   .populate('developer')
  //   .exec(function (err, list_games) {
  //     if (err) {
  //       return next(err);
  //     }
  //     //successful
  //     res.render('game_list', {
  //       title: 'Games',
  //       esrb_title: 'ESRB',
  //       developer_title: 'Developer',
  //       genre_title: 'Genre',
  //       platform_title: 'Platform',
  //       games_list: list_games,
  //     });
  //   });
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

exports.game_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: get create game');
};

exports.game_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game');
};

exports.game_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game');
};

exports.game_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game');
};

exports.game_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game');
};

exports.game_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: post create game');
};
