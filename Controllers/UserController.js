const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendgrid = require("../helpers/sendgrid")
const jwt = require('jsonwebtoken');

const UserController = {
  getAll(req, res) {
    User.find()
      .then((users) => {
        res.send(users)
        console.log("  -  Ejecutado UserController.getAll")
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  },
  getAllVendors(req, res) {
    User.find({
          rol: 'vendedor'
    })
    .then((users) => {
      res.send(users)
      console.log("  -  Ejecutado UserController.getAllVendors")
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send(error)
    })
  },
  async registerAsync(req, res) {
    try {
      const hash = await bcrypt.hash(req.body.password, 9)
      //console.log(req.body.password, hash);
      console.log("  -  Ejecutado UserController.registerAsync")
      req.body.password = hash

      req.body.rol = "cliente"
      req.body.confirmed = false
      const user = await User.create(req.body)

      await sendgrid.EnviarMailBienvenida(user),
        console.log("Correo bienvenida enviado")
      res.status(201).send(user)
    } catch (error) {
      console.error(error)
      if (error.keyPattern) {
        return res.status(400).send({
          message:
            "El usuario y/o email indicados ya estaban registrados; si es suyo trate de iniciar sesión, sino registrese con otro usuario distinto",
        })
      } else {
        res.status(500).send(error)
      }
    }
  },
  registerSync(req, res) {
    //Encriptado sincrono de la constraseña (puede dar problemas, mejor Async/Await)
    const hash = bcrypt.hashSync(req.body.password, 9)
    console.log(req.body.password, hash)
    req.body.password = hash

    req.body.rol = "cliente"
    req.body.confirmed = false

    User.create(req.body)
      .then((user) => {
        sendgrid.EnviarMailBienvenida(user),
          console.log("Correo bienvenida enviado")
        res.status(201).send(user)
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })

    //Método asincrono de encriptado, con promesas:
    // bcrypt.hash(req.body.password,9).then(hash => {
    //     console.log(req.body.password, hash);
    //     req.body.password = hash;

    //     User.create(req.body)
    //     .then(user=>res.status(201).send(user))
    //     .catch(error=> {
    //         console.error(error);
    //         res.status(500).send(error);
    //     });
    // })
  },
  async updateAsyc(req, res) {
    try {
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 9)
        req.body.password = hash
      }
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }) //con new:true indicamos que nos devuelva el registro actualizado, sino nos devolvera el registro original
      res.send(user)
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  },
  updateSync(req, res) {
    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, 9)
      req.body.password = hash
    }
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }) //con new:true indicamos que nos devuelva el registro actualizado, sino nos devolvera el registro original
      .then((user) => res.send(user))
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  },
  async InfoSync(req, res) {
    try {
      const user = await User.findOne({
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      })
      if (!user) {
        return res.status(400).send({
          message: "Usuario o email incorrecto",
        })
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password)
      console.log("Compara:", req.body.password, user.password, isMatch)

      if (!isMatch) {
        return res.status(400).send({
          message: "Credenciales incorrectas",
        })
      }
      res.status(200).send({ user })
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message: "Ocurrió al obtener los datos del usuario: " + error,
      })
    }
  },
  deleteSync(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then((user) => {
        sendgrid.enviarCorreo(
          user.email,
          "Hemos borrado tu cuenta de usuario",
          `correo ${user.email} borrado`,
          `<h3>${user.name} lamentamos que quieras irte, pero respetamos tus deseos.</h3> La cuenta ${user.email} ha sido ya borrado de nuestros servidores.</h4>`
        ),
          console.log("Correo de borrado de usuario enviado")
        res.send(user)
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  },
  async deleteAsync(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id, req.body)
      if (!user) {
        return res.status(204).send() //No content
      }
      await sendgrid.enviarCorreo(
        user.email,
        "Hemos borrado tu cuenta de usuario",
        `correo ${user.email} borrado`,
        `<h3>${user.name} lamentamos que quieras irte, pero respetamos tus deseos.</h3> La cuenta ${user.email} ha sido ya borrado de nuestros servidores.</h4>`
      ),
        console.log("Correo de borrado de usuario enviado")
      res.send(user)
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message:
          "Hubo un problema tratando de eliminar el usuario con id: " +
          req.params.id,
        error,
      })
    }
  },
  async confirmAsync(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { confirmed: true },
        { new: true }
      );

      sendgrid.EnviarCorreo(
        user.email,
        "Gracias por confirmar tu correo",
        `Correo ${user.email} confirmado`,
        `<h3>Muchas gracias ${user.name} por confirmar su correo ${user.email}.</h3><h4>Ya puede usar nuestros servicios.</h4>`
      );     
      console.log("Correo gracias por confirmar enviado");

      res.send(user);
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message: "Hubo un problema al confirmar el usuario",
        error,
      })
    }
  },
  confirmSync(req, res) {
    User.findByIdAndUpdate(req.params.id, { confirmed: true }, { new: true })
      .then((user) => {
        sendgrid.enviarCorreo(
          user.email,
          "Gracias por confirmar tu correo",
          `correo ${user.email} confirmado`,
          `<h3>Muchas gracias ${user.name} por confirmar su correo ${user.email}.</h3><h4>Ya puede usar nuestros servicios.</h4>`
        ),
          console.log("Correo gracias por confirmar enviado")
        res.send(user)
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send({
          message: "Hubo un problema al confirmar el usuario",
          error,
        })
      })
  },
  async login(req, res) {
    try {
      const user = await User.findOne({
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      })
      if (!user) {
        return res.status(400).send({
          message: "Usuario o email incorrecto",
        })
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password)
      console.log("Compara:", req.body.password, user.password, isMatch)

      if (!isMatch) {
        return res.status(400).send({
          message: "Credenciales incorrectas",
        })
      }

      const token = await user.generateAuthToken()
      if (user.tokens.length >= 5) user.tokens.shift() //Solo guardo los 5 ultimos tokens, asi, si hay 5 o más, quito el más antiguo
      user.tokens.push(token) // y añado el nuevo.

      await User.findByIdAndUpdate(user._id, {
        tokens: user.tokens,
      })

      res.send({
        user,
        token,
      })
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message: "Ocurrió un problema al indentificar al usuario: " + error,
      })
    }
  },
  async logout(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id, //Lo obtiene del token recibido en la cabecera Authorization
        {
          $pull: {
            tokens: req.headers.authorization,
          },
        },
        { new: true }
      )
      res.json({
        user,
        message: `${user.name} cerró sesión`,
      })
    } catch (error) {
      console.error(error)
      res.status(500).send({
        message: "Ocurrió un desconectar al usuario",
      })
    }
  },
}


module.exports = UserController;
