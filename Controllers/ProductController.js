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
      Category.updateMany(
        { }, //busca en toda la colección
        { $pull: { products: req.params.id } },
        { multi: true }
      )
      .then ((res) => {console.log("Producto borrado de las categorias que tenía asociadas.")})
      .catch(error => {
        console.error(error);
        // res.status(500).send(error);
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
        Category.updateMany(
          { _id: { $in: product.categories } },
          { $pull: { products: product._id } },
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
  async getProductSortedBySmallerPrice(req, res) {
    try {
      //https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
      const prods = await Product.aggregate( 
        [
          { $sort : { price_VAT: 1 } }
        ])      
      //console.log(prods)
      res.status(200).send(prods);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },  
  async getProductSortedByBiggerPrice(req, res) {
    try {
      //https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
      const prods = await Product.aggregate( 
        [
          { $sort : { price_VAT: -1 } }
        ])      
      //console.log(prods)
      res.status(200).send(prods);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },    
  async getProductSortedByName(req, res) {
    try {
      //https://docs.mongodb.com/manual/reference/operator/aggregation/sort/
      const prods = await Product.aggregate( 
        [
          { $sort : { name: 1 } }
        ])      
      //console.log(prods)
      res.status(200).send(prods);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },  
  async getProductSortedByOrdersQty(req, res) {
    try {
      //https://docs.mongodb.com/manual/reference/operator/aggregation/project/index.html
      const mejoresVentas= await Product.aggregate([
       {$project:
           {
              _id: "$_id",
              nombre : "$name",
              PrecioIVA : "$price_VAT",
              stock : "$stock",
              ventas:{$size:{"$ifNull":["$ordersId",[]]} }
           },
       },
       {$match: {
           ventas: {
               $gt:0
           }
       }},
       {$sort : {ventas : -1}}, 
       //{$limit : 5 }
    ]);
    res.status(200).json({'ProdcutosMasVendidos': mejoresVentas});
   } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Ocurrió un error al realizar la consulta' })
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
        //console.error(error)
        res.status(500).send(error)
      })
  },
  getAllByVendor(req, res) {
    Product.find({ userId: req.params.id })
      .populate("categories") 
      .then((products) => res.send(products))
      .catch((error) => {
        //console.error(error)
        res.status(500).send(error)
      })
  },
  getAllByCategory(req, res) {
    Product.find({ categories: req.params.id })
      .populate("categories") 
      .then((products) => res.send(products))
      .catch((error) => {
        console.error(error)
        res.status(500).send(error)
      })
  }
}

module.exports = ProductController
