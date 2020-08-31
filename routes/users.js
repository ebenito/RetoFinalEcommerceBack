var express = require('express');
var router = express.Router();

const User= require('../models/User');
const UserController = require('../Controllers/UserController');
const authenticate = require('../middleware/authenticate');
const checkRol = require('../middleware/checkRol');


router.post('/registrar', UserController.registerAsync); //Crear cliente en DB y le envía correo de bienvenida, con link para confirmar
router.post('/registrar/sync', UserController.registerSync);

router.get('/confirm/:id', UserController.confirmAsync);
router.get('/confirm/sync/:id', UserController.confirmSync);

router.post('/login', UserController.login)
router.post('/logout', authenticate, UserController.logout); //Solo accesible si está autenticado

router.put('/actualiza/:id', UserController.updateAsyc);
router.put('/actualiza/sync/:id', UserController.updateSync);

router.delete('/borra/:id', UserController.deleteAsync);
router.delete('/borra/sync/:id', UserController.deleteSync);

router.post('/info', UserController.InfoSync);

//De esta forma inyecto el objeto user en la vista, para su procesado por la plantilla:
router.get('/info', async function (req, res, next) {    
    const usuario = await User.findOne({
        $or: [{
            email: 'prueba@hotmail.es'
        }, {
            username: 'TEST'
        }]
    });

    console.log('usuario:', usuario.username);
    res.render('user', {user: usuario});
});
router.get('/listado', async function (req, res, next) {    
    const usuarios = await User.find();
    res.render('user', {user: usuarios});
});

//Solo usuarios con rol Admin:

router.get('/todos', checkRol(['admin']), UserController.getAll);


//Pruebas de colocar procesos repetitivos en funciones:

const GetInfoUserPRUEBA = require('../Controllers/GetInfoUserPRUEBA');

router.post('/info1', GetInfoUserPRUEBA.InfoAsync);
router.post('/info2', GetInfoUserPRUEBA.InfoSync);
router.post('/info3', GetInfoUserPRUEBA.InfoSync2);

module.exports = router;
