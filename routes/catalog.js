var express = require('express');
var router = express.Router();
var async = require('async');

const developerController = require('../controllers/developerController')
const esrbController = require('../controllers/esrbController');
const gameController = require('../controllers/gameController');
const gameinstanceController = require('../controllers/gameinstanceController');
const genreController = require('../controllers/genreController');
const platformController = require('../controllers/platformController');
const Developer = require('../models/developer');
const Game = require('../models/game')
const Esrb = require('../models/esrb');
const GameInstance = require('../models/gameinstance');
const Genre = require('../models/genre');
const Platform = require('../models/platform');

/* GET users listing. */
router.get('/', function(req,res,next) {
  async.parallel(
    {
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
      res.render('catalog', {
        title: 'Categories',
        esrb_title: 'ESRB',
        developer_title: 'Developer',
        genre_title: 'Genre',
        platform_title: 'Platform',
        error: err,
        data: results,
      });
    }
  );
});

router.get('/game/:id', gameController.game_detail);

router.get('/games', gameController.game_list);

router.get('/gameinstance/:id', gameinstanceController.gameinstance_detail);

router.get('/gameinstances', gameinstanceController.gameinstance_list);

router.get('/esrb/:id', esrbController.esrb_detail);

router.get('/esrbs', esrbController.esrb_list);

router.get('/developer/:id', developerController.developer_detail);

router.get('/developers', developerController.developer_list);

router.get('/genre/:id', genreController.genre_detail);

router.get('/genres', genreController.genre_list);

router.get('/platform/:id', platformController.platform_detail);

router.get('/platforms', platformController.platform_list);



module.exports = router;