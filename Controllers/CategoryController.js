const Category = require('../models/Category');

const CategorieController = {
    insert(req,res) {
        Category.create(req.body)
         .then(category => res.status(201).send(category))
         .catch(error => {
             console.error(error);
             res.status(500).send({message:'Hubo un problema al crear la categoria.', error});
         })
    }
};

module.exports = CategorieController;