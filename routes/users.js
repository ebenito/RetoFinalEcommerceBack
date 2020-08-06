var express = require('express');
var router = express.Router();
const UserController = require('../Controllers/UserController');

// router.get('/', function(req, res, next) {
//     res.render('user', { user: UserController.getAll });
// });

router.get('/', UserController.getAll);

router.get('/confirm/:id', UserController.confirmAsync);
router.get('/confirm/sync/:id', UserController.confirmSync);

router.post('/', UserController.registerAsync);
router.post('/sync', UserController.registerSync);

router.post('/login', UserController.login)

router.put('/:id', UserController.updateAsyc);
router.put('/sync/:id', UserController.updateSync);
;
router.delete('/:id', UserController.deleteAsync);
router.delete('/sync/:id', UserController.deleteSync)

module.exports = router;
