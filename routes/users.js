var express = require('express');
var router = express.Router();

const User= require('../models/User');
const UserController = require('../Controllers/UserController');

router.get('/', UserController.getAll);

router.get('/confirm/:id', UserController.confirmAsync);
router.get('/confirm/sync/:id', UserController.confirmSync);

router.post('/', UserController.registerAsync);
router.post('/sync', UserController.registerSync);

router.post('/login', UserController.login)

router.put('/:id', UserController.updateAsyc);
router.put('/sync/:id', UserController.updateSync);

router.delete('/:id', UserController.deleteAsync);
router.delete('/sync/:id', UserController.deleteSync);


router.get('/info', async function (req, res, next) {    
    const usuario = await User.findOne({
        $or: [{
            email: 'esteban.benito@gmail.com'
        }, {
            username: 'ebenito'
        }]
    });

    console.log('usuario:', usuario.username);
    res.render('user', {user: usuario});
});


router.get('/listado', async function (req, res, next) {    
    const usuarios = await User.find();
    res.render('user', {user: usuarios});
});


module.exports = router;
