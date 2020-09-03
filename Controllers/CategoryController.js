const Category = require('../models/Category');

const CategorieController = {
    getAll(req,res) {
        Category.find().select('name')       
        .then(products => res.status(201).send(products))
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
    },
    getAllWithCategories(req,res) {
        Category.find()
        .populate('products') //Sin esta línea nos da solo el ID, con ella saca todos los datos relacionados, a modo de inner join. Hace referencia al nombre del campo del modelo.
        .then(products => res.status(201).send(products))
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
    },
    insert(req,res) {
        Category.create(req.body)
         .then(category => res.status(201).send(category))
         .catch(error => {
             console.error(error);
             res.status(500).send({message:'Hubo un problema al crear la categoría.', error});
         })
    },
    update(req,res) {
        Category.findOneAndUpdate(req.param.id, req.body, {new:true})
         .then(product => res.send(product))
         .catch(error => {
            console.error(error);
            res.status(500).send({message:'Hubo un problema al actualizar el categoría.', error});
        });
    },
    delete(req,res) {
        Category.findByIdAndDelete(req.params.id, req.body) 
         .then(product => res.send(product))
         .catch(error => {
            console.error(error);
            res.status(500).send({message:'Hubo un problema al borrar el categoría.', error});
        });
    }
};

module.exports = CategorieController;