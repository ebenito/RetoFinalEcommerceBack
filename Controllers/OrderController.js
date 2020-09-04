const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const sendgrid = require("../helpers/sendgrid")

const OrderController = {
  insert(req,res) {
    req.body.status = "pendiente"
    let resProds;

    Order.create(req.body)
    .then((newOrder) => {
      Product.updateMany( {_id: { $in: req.body.products }} ,
        { $push: { ordersId: newOrder._id } },
        { new: true, multi: true } )
        .then((dbresP) => {
          //console.log("Resultado upd Productos: ", dbresP)
          Product.find({ _id: { $in: req.body.products }})
          .then((res) =>  {
            resProds = res;

            User.findByIdAndUpdate({_id:req.body.userId},
              { $push: { ordersID: newOrder._id } },
              { new: true } )
              .then((dbresU) => {
                //console.log("Resultado upd Usuario: ", dbres)
  
                let bodyHTML = `<h3>Gracias por tu compra ${dbresU.name} </h3>            
                  <div> Orden de compra: <ul>`
                
                let x = 0;
                resProds.forEach((element) => {
                  //console.log(element);                  
                  bodyHTML += `<li>${element.name}: Cant: ${newOrder.products[x].cantidad}</li>`
                  x+=1;
                })
  
                bodyHTML += "</ul></div>"
  
                sendgrid.EnviarCorreo(
                  dbresU.email,
                  "Gracias por su pedido",
                  "Hemos recibido correctamente su prepido, en breve lo recibirá. Gracias por su compra",
                  bodyHTML
                )
              })
              .catch((error) => {
                console.error(error)            
              });
          })
          .catch((error) => {
            console.error(error)            
          });

        })
        .catch((error) => {
          console.error(error)            
        });
        res
          .status(201)
          .json({ newOrder, message: "pedido creado con éxito" })
    })
    .catch((error) => {
      console.error(error)
      res
        .status(500)
        .send({ message: "Hubo un problema al crear el pedido.", error })
    })
  },
  update(req, res) {
    Order.findOneAndUpdate(req.param.id, req.body, { new: true })
      .then((product) => res.send(product))
      .catch((error) => {
        console.error(error)
        res.status(500).send({
          message: "Hubo un problema al actualizar el pedido.",
          error,
        })
      })
  },
  delete(req, res) {
    Order.findByIdAndDelete(req.params.id, req.body)
      .then((product) => res.send(product))
      .catch((error) => {
        console.error(error)
        res
          .status(500)
          .send({ message: "Hubo un problema al borrar el pedido.", error })
      })
  },
}

module.exports = OrderController
