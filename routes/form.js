var express = require('express');
var router = express.Router();
const developerController = require('../controllers/developerController')
const esrbController = require('../controllers/esrbController');
const gameController = require('../controllers/gameController');
const gameinstanceController = require('../controllers/gameinstanceController');
const genreController = require('../controllers/genreController');
const platformController = require('../controllers/platformController');


/* developer form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/developer/create', developerController.developer_create_get);

router.post('/developer/create', developerController.developer_create_post);

router.get('/developer/:id/delete', developerController.developer_delete_get);

router.post('/developer/:id/delete', developerController.developer_delete_post);

router.get('/developer/:id/update', developerController.developer_update_get);

router.post('/developer/:id/update', developerController.developer_update_post);

/* esrb form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/esrb/create', esrbController.esrb_create_get);

router.post('/esrb/create', esrbController.esrb_create_post);

router.get('/esrb/:id/delete', esrbController.esrb_delete_get);

router.post('/esrb/:id/delete', esrbController.esrb_delete_post);

router.get('/esrb/:id/update', esrbController.esrb_update_get);

router.post('/esrb/:id/update', esrbController.esrb_update_post);


/* game form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/game/create', gameController.game_item, gameController.game_create_get);

router.post('/game/create', gameController.game_create_post);

router.get('/game/:id/delete', gameController.game_delete_get);

router.post('/game/:id/delete', gameController.game_delete_post);

router.get('/game/:id/update', gameController.game_update_get);

router.post('/game/:id/update', gameController.game_update_post);

/* gameinstance form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/gameinstance/create', gameinstanceController.gameinstance_create_get);

router.post('/gameinstance/create', gameinstanceController.gameinstance_create_post);

router.get('/gameinstance/:id/delete', gameinstanceController.gameinstance_delete_get);

router.post('/gameinstance/:id/delete', gameinstanceController.gameinstance_delete_post);

router.get('/gameinstance/:id/update', gameinstanceController.gameinstance_update_get);

router.post('/gameinstance/:id/update', gameinstanceController.gameinstance_update_post);

/* genre form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/genre/create', genreController.genre_create_get);

router.post('/genre/create', genreController.genre_create_post);

router.get('/genre/:id/delete', genreController.genre_delete_get);

router.post('/genre/:id/delete', genreController.genre_delete_post);

router.get('/genre/:id/update', genreController.genre_update_get);

router.post('/genre/:id/update', genreController.genre_update_post);

/* platform form. */
// router.get('/developers', developerController.developer_create_get);

router.get('/platform/create', platformController.platform_create_get);

router.post('/platform/create', platformController.platform_create_post);

router.get('/platform/:id/delete', platformController.platform_delete_get);

router.post('/platform/:id/delete', platformController.platform_delete_post);

router.get('/platform/:id/update', platformController.platform_update_get);

router.post('/platform/:id/update', platformController.platform_update_post);

module.exports = router;