const Product = require('../models/Product');

const ProductController = {
    insert(req,res) {
        Product.create(req.body)
         .then(product => res.status(201).send(product))
         .catch(error => {
             console.error(error);
             res.status(500).send({message:'Hubo un problema al crear el producto.', error});
         })
    },
    getAll(req,res) {
        Product.find()
        .populate('categories') //Sin esta línea nos da solo el ID, con ella saca todos los datos relacionados, a modo de inner join
        .then(products => res.send(products))
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
    },
    update(req,res) {
        Product.findOneAndUpdate(req.param.id, req.body, {new:true})
         .then(product => res.send(product))
         .catch(error => {
            console.error(error);
            res.status(500).send({message:'Hubo un problema al actualizar el producto.', error});
        });
    },
    delete(req,res) {
        Product.findByIdAndDelete(req.params.id, req.body) 
         .then(product => res.send(product))
         .catch(error => {
            console.error(error);
            res.status(500).send({message:'Hubo un problema al borrar el producto.', error});
        });
    }
};

module.exports = ProductController;