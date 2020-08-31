const jwt = require('jsonwebtoken');
const User= require('../models/User');
require('dotenv').config();

  const checkRol = (rolesPermitidos) => async(req, res, next) => {
      try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({
            _id: payload._id,
            tokens: token
        });        
    
        if (user && rolesPermitidos.includes(user.rol)) {
            next(); //el rol está permitido, así que continúa con lo siguiente 
          } else {
            response.status(403).json({message: "Prohibido: Acceso no autorizado."}); // usuario sin acceso
          }
      } catch (error) {
        console.error(error)
        res.status(401).send({ message: 'Acceso no autorizado', error })
      }
    
}


module.exports = checkRol;