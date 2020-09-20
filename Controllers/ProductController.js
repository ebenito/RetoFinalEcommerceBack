const Product = require("../models/Product")
const Category = require("../models/Category")

const ProductController = {
  insert(req, res) {
    Product.create(req.body)
      .then((product) => {
        Category.updateMany(
          { _id: { $in: req.body.categories } },
          { $push: { products: product._id } },
          { multi: true }
        )
          .then((dbres) => {
            //console.log(dbres)
            res.status(201).send(product)
          })
          .catch((error) => {
            console.error(error)
          })
      })
      .catch((error) => {
        console.error(error)
        res
          .status(500)
          .send({ message: "Hubo un problema al crear el producto.", error })
      })
  },
  update(req, res) {
    if (req.body.categories != null){ //Si envio una categoria ya previamente vinculada se duplicaría, por eso elimino antes las enviadas, por si ya existen.
      req.body.categories.forEach((item) => {
        Category.findByIdAndUpdate(
          item,
          { $pull: { products: req.params.id }}).select('name')
          .then ((res) => {console.log("Producto borrado de la categoria:", res)})
          .catch(error => {
            console.error(error);
            // res.status(500).send(error);
          }); 
      });
    };
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((product) => {
        Category.updateMany(
          { _id: { $in: req.body.categories } },
          { $push: { products: product._id } },
          { multi: true }
        )
          .then((dbres) => {
            //console.log(dbres)
             res.status(201).send(product)
          })
          .catch((error) => {
            console.error(error)
          })
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send({
          message: "Hubo un problema al actualizar el producto.",
          error,
        })
      })
  },
  delete(req, res) {
    Product.findByIdAndDelete(req.params.id, req.body)
      .then((product) => {
        Category.findByIdAndUpdate(
          product.categories,
          {
            $pull: {
              products: product._id,
            },
          },
          { multi: true }
        ).then((dbres) => {
          //console.log(dbres)
          res.status(201).send(product)
        })
      })
      .catch((error) => {
        console.error(error)
        res
          .status(500)
          .send({ message: "Hubo un problema al borrar el producto.", error })
      })
  },
  async getNameProduct(req, res) {
    try {
      const prod = await Product.findById(req.params.id)
      //console.log(prod)
      res.status(200).send(prod.name);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getNameProductSync(req, res) {
    Product.findById(req.params.id)
    .then((prod) => {      
      //console.log(prod);
      res.send(prod.name);
    })
    .catch ((error) => {
      res.status(500).send(error);
    })
  },
  getAll(req, res) {
    Product.find()
      .populate("categories") //Sin esta línea nos da solo el ID, con ella saca todos los datos relacionados, a modo de inner join. Hace referencia al nombre del campo del modelo.
      .populate("userId")
      .then((products) => res.send(products))
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  },
  getAllByVendor(req, res) {
    Product.find({ userId: req.params.id })
      .populate("categories") //Sin esta línea nos da solo el ID, con ella saca todos los datos relacionados, a modo de inner join. Hace referencia al nombre del campo del modelo.
      .then((products) => res.send(products))
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  },
}

module.exports = ProductController
