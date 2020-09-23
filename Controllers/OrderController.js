const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const sendgrid = require("../helpers/sendgrid")

const OrderController = {
  async insert(req, res) {
    req.body.status = "pendiente"
    let lstProds = '';
    let bodyHTML = '';
    let UserEmail = '';

    try {
      //Creo el pedido
      const newOrder = await Order.create(req.body);
      if (newOrder != null) {
        //Añado en el array para pedidos del modelo de productos, el ID del pedido.
        //No uso findByIdAndUpdate porque solo devuelve 1 doc, asi debo hacer dos pasos para obtener los nombres
        const products = await Product.updateMany(
                          { _id: { $in: req.body.products } },
                          { $push: { ordersId: newOrder._id } },
                          { new: true, multi: true })
        if (products != null) {
          for (let i = 0; i <= newOrder.products.length-1; i++) {
          //const nombProds = await Product.findById( newOrder.products[i].id );
          const nombProds = await buscaProdAsync( newOrder.products[i].id );
            lstProds += `<li>${nombProds.name}: Cant: ${newOrder.products[i].cantidad}</li>`;
            
            //Resto el stock
            let newStock = nombProds.stock - newOrder.products[i].cantidad;
            await Product.findByIdAndUpdate(newOrder.products[i].id, {  stock: newStock });
            if (newStock == 0 && nombProds.userId != null) {
              sendgrid.EnviarCorreo(
                nombProds.userId.email,
                 "Se ha quedado sin stock de " + nombProds.name,
                 "Reponga urgentemente el stock de este producto o retirelo de la venta.",
                 `<h1>Se ha quedado sin stock de ${nombProds.name}:</h1><h2>Reponga urgente el stock o retire el producto de la venta</h2><b>Si no realiza ninguna acción el producto seguirá en venta, quedando pendiente de servir a los clientes que lo adquieran.</b>`
               );
               console.log ('Correo de aviso de ruptura de stock enviado al vendedor');
            }

            //Envio correo con resumen de pedido al administrador
            if (nombProds.userId != null) {
               sendgrid.EnviarCorreo(
                nombProds.userId.email,
                 "Se ha realizado un pedido",
                 "Enhorabuena, acaba de realizar un pedido; revise los detalles en la plataforma para realizar el envío.",
                 `<h1>Enhorabuena ${nombProds.userId.name}, acaba de vender este producto:</h1><li>${nombProds.name}: Cant: ${newOrder.products[i].cantidad}</li><h2>Revise los detalles del pedido ID ${newOrder.id}`
               );
               console.log ('Correo de aviso al vendedor enviado')
            };
          };

          //Obtengo los datos del cliente, y le añada refencia el pedido
          const user = await  User.findByIdAndUpdate(req.body.userId,
                        { $push: { ordersId: newOrder._id } },
                        { new: true })
          if (user != null) {
            //console.log(user.name, lstProds);
            bodyHTML = `<h3>Gracias por tu compra ${user.name} </h3>            
                <div> Orden de compra: <ul>`
            bodyHTML += lstProds +"</ul></div>";

            //Envio correo con resumen de pedido al cliente
            sendgrid.EnviarCorreo(
              user.email,
              "Gracias por su pedido",
              "Hemos recibido correctamente su prepido, en breve lo recibirá. Gracias por su compra",
              bodyHTML
            );
            console.log ('Correo de agradecimiento enviado')           
            
            res.status(201).json({ newOrder, message: "pedido creado con éxito" })
          };
        };
      };
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al crear el pedido.", error })
    }
  },
  async getOrderInfo(req, res) {
    try {      
      const order = await Order.findById(req.params.id)
      .populate("products._id");
      if (order != null) {
        res.status(200).send(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al obtener los datos del pedido." })
    }
  },  
  async getOrdersByUserId(req, res) {
    try {      
      const order = await Order.find( { userId : req.params.id })
      .populate("products._id");
      if (order != null) {
        res.status(200).send(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema obtener los pedido del cliente." })
    }
  },
  async updOrderPayed(req, res) {
    try {      
      const order = await Order.findByIdAndUpdate(req.body.id, { status: 'Pagado' }, { new: true });
      if (order != null) {
        res.status(200).send(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema establecer como pagado el pedido." })
    }
  },
  async updOrderSended(req, res) {
    try {      
      const order = await Order.findByIdAndUpdate(req.body.id, { status: 'Enviado' }, { new: true });
      if (order != null) {
        res.status(200).send(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema establecer como pagado el pedido." })
    }
  },
  update(req, res) {
    Order.findOneAndUpdate(req.params.id, req.body, { new: true })
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

var escribeListaProds = function (arrayProds) {
  return new Promise(function (resolve, reject) {
    let listaProductos = ""
    arrayProds.forEach((element) => {
      console.log(element.id, element.cantidad)
      buscaProd(element.id)
        .then((res) => {
          listaProductos += `<li>${res.name}: Cant: ${element.cantidad}</li>`;
          console.log(listaProductos);
        })
        .catch((error) => {
          reject = error
        })
      //Promise.all([buscaProd(element.id)]).then(value => {
      //listaProductos += `<li>${value}: Cant: ${element.cantidad}</li>`
    })

    var i = 0;
    do {
      if (checkResult(listaProductos))
      {
        resolve = listaProductos;
      }
      i++;
    }
    while (i < 5);


  })
}

function checkResult(lst) {
  if (lst == '')
  {return false}
  else {return true}
}


var buscaProdPromise =  function(prodID) {
  return new Promise(function(resolve, reject) {
    Product.findById(prodID)
    .then((res) =>  {
      //console.log(res); 
      if (res != null){
        resolve = res.name;
        //console.log(res.name);
      } else {
        const res = new claseProd('producto ref: ' + prodID);
        resolve = res;
      }
    })
    .catch((error) => {
      reject = error;         
    });
  });
}


var buscaProdAsync = async function (prodID) {
  try {
    const prod = await Product.findById(prodID)
    .populate("userId");
    //console.log(prod)
    if (prod != null){
      return prod;
    } else {      
      const res = new claseProd('producto ref: ' + prodID);
      return res;
    }
  } catch (error) {
    console.log(error);
    return "";
  }
}

function claseProd (valor){ 
  this.name = valor  
}

module.exports = OrderController
