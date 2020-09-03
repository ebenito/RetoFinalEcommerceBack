const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendgrid = require('../helpers/sendgrid');
const jwt = require('jsonwebtoken');

const GetInfoUserPRUEBA = {  
  async InfoAsync(req, res) {
    try {
      if (await confirmaUsuario(req, res)) {
        const user = await User.findOne({
          $or: [{
              email: req.body.email
          }, {
              username: req.body.username
          }]
        });
        res.send(user)
      }
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  },
  InfoSync(req, res) {
    try {
      CheckUsuario(req)
        .then((res) => {
          console.log("Info ok", res.user)
        })
        .catch((error) => {
          console.log("Info ko")
          console.error(error)
          res.status(500).send(error)
        })
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  },
  InfoSync2(req, res) {
    CheckUsuario(req)
      .then(() => {
        // User.findOne({
        //   $or: [{
        //       email: req.body.email
        //   }, {
        //       username: req.body.username
        //   }]
        // })
        // .then((user) => {
        //   res.send(user)
        // })
        // .catch((error) => {
        //   console.error(error)
        //   res.status(500).send(error)
        // })
        console.log("Info ok")
      })
      .catch((error) => {
        console.log("Info ko")
        console.error(error)
        res.status(500).send(error)
      })
  }
}


module.exports = GetInfoUserPRUEBA;


const confirmaUsuario = async (req, res) => {
  const user = await User.findOne({
    $or: [
      {
        email: req.body.email
      },
      {
        username: req.body.username
      },
    ],
  })
  if (!user) {
    return false;
  }
  
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  console.log("Compara:", req.body.password, user.password, isMatch);

  return isMatch;
}

let CheckUsuario = (req) => {
  return new Promise( (resolve, reject) => {
    User.findOne({
      $or: [
        {
          email: req.body.email
        },
        {
          username: req.body.username
        },
      ],
    })
    .then ((user) => {
        if (!user) {
          console.log("Usuario o email incorrecto");
          reject = "Usuario o email incorrecto";
        }
        else {
          const isMatch = bcrypt.compareSync(req.body.password, user.password);
          console.log("Compara:", req.body.password, user.password, isMatch);
      
          if (!isMatch) {
            console.log("Credenciales incorrectas");
            reject = "Credenciales incorrectas";
          } else {
            console.log("Usuario "+ user.username + ": OK");
            resolve = user;
          }
        }
      })
    .catch((error) => {
      console.log("Hubo un problema al confirmar el usuario:", error);
      reject = "Hubo un problema al confirmar el usuario"
    })
  })
}