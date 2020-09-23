const Invoice = require("../models/Invoice")
const sendgrid = require("../helpers/sendgrid")

const InvoiceController = {
  async insert(req, res) {
    try {
      const invoice =await Invoice.create(req.body);
      if (invoice != null) {
        enviarCorreoConFactura(invoice);
        res.status(201).send(invoice);
      }
    } catch (error) {
      //console.error(error);
      res.status(500).send({ message: "Hubo un problema al crear la factura." })
    }
  },
  async getInvoiceInfo(req, res) {
    try {      
      const invoice = await Invoice.findById(req.params.id)
        .populate("OrderId")      
        .populate({ 
          path: 'OrderId',
          populate: {
            path: 'products._id',
            model: 'Product'
          } 
       })
       .populate({ 
        path: 'OrderId',
        populate: {
          path: 'userId',
          model: 'User'
        } 
     });

      if (invoice != null) {
        let Total_VAT = 0;
        let Total_wo_VAT = 0;
        
        invoice.OrderId.products.forEach(element => {         
          Total_wo_VAT += element._id.price_wo_VAT * element.cantidad;
          Total_VAT += element._id.price_VAT * element.cantidad;
        });
        
        res.status(200).json({ invoice, totalAmount_wo_VAT: Total_wo_VAT, totalAmount_VAT: Total_VAT });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al obtener los datos de la factura." })
    }
  },  
  async updInvoice(req, res) {
    try {      
      const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (invoice != null) {
        enviarCorreoConFactura(invoice);
        res.status(200).send(invoice);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Hubo un problema al modificar la factura." })
    }
  },
}


var enviarCorreoConFactura = async function(invoice) {
  try {
    const invoiceData = await Invoice.findById(invoice._id)
        .populate("OrderId")      
        .populate({ 
          path: 'OrderId',
          populate: {
            path: 'products._id',
            model: 'Product'
          } 
       })
       .populate({ 
        path: 'OrderId',
        populate: {
          path: 'userId',
          model: 'User'
        } 
     });

    if (invoiceData != null) {
      let Total_VAT = 0;
      let Total_wo_VAT = 0;
      let Purchase = '';

      invoiceData.OrderId.products.forEach(element => {
        Purchase += `<li>${element._id.name} - Precio sin IVA: ${element._id.price_wo_VAT} - Cant: ${element.cantidad} - Subtotal: ${element._id.price_wo_VAT * element.cantidad}</li>`;

        Total_wo_VAT += element._id.price_wo_VAT * element.cantidad;
        Total_VAT += element._id.price_VAT * element.cantidad;
      });

      //Envio correo con datos de factura:
      let bodyHTML = `<h3>${invoiceData.OrderId.userId.name}, gracias por su compra en beCom; le detallamos a continuación el detalle de su compra:</h3>
        <p>Número de factura: ${invoiceData._id}</p>
        <p>Dirección de envío:<br>
        ${invoiceData.OrderId.userId.name}<br>
        ${invoiceData.address}</p>
        <p>PRODUCTOS COMPRADOS;</p>
        <ul>${Purchase}</ul>
        <h3>Total sin IVA: ${Total_wo_VAT}</h3>
        <h3>Total con IVA: ${Total_VAT}</h3>`;

      sendgrid.EnviarCorreo(
        invoiceData.OrderId.userId.email,
        "Factura de su pedido",
        "Le informamos del detalle de la factura emitida a su nombre. Gracias por su compra",
        bodyHTML
      );
    }
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
}

module.exports = InvoiceController
