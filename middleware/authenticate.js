const jwt = require('jsonwebtoken');
const User= require('../models/User');

const authenticate = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, 'beCommTokenSystem');
        const user = await User.findOne({
            _id: payload._id,
            tokens: token
        });
        if (!user) {
            return res.status(401).send({
                message: 'Usted no está autorizado'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).send({ message: 'Acceso no autorizado', error })
    }
}


module.exports = authenticate;