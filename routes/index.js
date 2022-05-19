var express = require('express');
var router = express.Router();

const gameController = require('../controllers/gameController');

/* GET home page. */
router.get('/', gameController.index);

module.exports = router;
