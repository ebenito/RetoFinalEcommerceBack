const Invoice = require("../models/Invoice")
const Order = require("../models/Order")
const User = require("../models/User")

const InvoiceController = {
  async insert(req, res) {
    Invoice.create(req.body)
    // .populate("OrderId")
    // .populate("UserId")
      .then((invoice) => {
        //console.log(dbres)
        res.status(201).send(invoice)    
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send({ message: "Hubo un problema al crear la factura.", error })
      })
  },
  async getInvoiceInfo(req, res) {
    try {      
      const invoice = await Invoice.findById(req.params.id)
        .populate("OrderId")
        .populate( {path: 'products', select: 'products._id'})
        .populate("UserId");

      if (invoice != null) {
        res.status(200).send(invoice);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al obtener los datos del pedido." })
    }
  },  
  async updInvoice(req, res) {
    try {      
      const order = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (order != null) {
        res.status(200).send(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al modificar la factura." })
    }
  },
}

module.exports = InvoiceController
