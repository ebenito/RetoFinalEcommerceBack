const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Category = require('../models/Category');

let ProductSchequema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:String,
    price_wo_VAT: {
        type:Number,
        required : [false, 'Debe indicar el precio SIN IVA']
    },
    price_VAT: {
        type:Number,
        required : [true, 'Debe indicar el precio CON IVA']
    },
    VAT: {
        type:Number,
        required : [true, 'Debe indicar el % de IVA a aplicar.']
    },
    image_path:String,
    stock: {
        type: Number,
        required: true
    },
    categories:[{
        type:ObjectId,
        ref:'Category'
    }],
    ordersId: [{
        type: ObjectId,
        ref: 'Order'
    }],
    userId:[{
        type: ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.ordersId;
            delete ret.userId;
            return ret;
        }
    }  
});


//Actualizo directamente el precio sin IVA a partir del precio final, con IVA, y el porcentaje de IVA
ProductSchequema.pre('save', function(next) {
    try {
        const producto = this;
       // producto.price_VAT = producto.price_wo_VAT + (producto.price_wo_VAT * producto.VAT / 100);
        producto.price_wo_VAT = parseFloat(intlRound(producto.price_VAT / ((producto.VAT / 100) + 1)));
        console.log(producto.price_VAT, producto.price_wo_VAT);

        // if (producto.categories != null){
        //     let prodUniques="";
        //     prodUniques = _.uniq(producto.categories);
        
        //     console.log(prodUniques);
        
        //     Category.find({ products: { $in: producto._id }})
        //     .then((res) => {
        //         res.forEach((item) => {            
        //             console.log("item db:",item);
        //             prodUniques =  prodUniques.splice(prodUniques.indexOf(item._id), 1);
        //         })       
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     // res.status(500).send(error);
        //     });
        
        //     console.log(prodUniques);
        //     this.categories = prodUniques
        // }       

    } catch (error) {
        console.error(error);
    } finally {
        next();
    }
});  

  ProductSchequema.post('init', function(doc) {
    console.log('%s has been initialized from the db', doc._id);
  });
  ProductSchequema.post('validate', function(doc) {
    console.log('%s has been validated (but not saved yet)', doc._id);
  });
  ProductSchequema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
  });
  ProductSchequema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
  });

function intlRound(numero, decimales = 2, usarComa = false) {
    var opciones = {
        maximumFractionDigits: decimales, 
        useGrouping: false
    };
    usarComa = usarComa ? "es" : "en";
    return new Intl.NumberFormat(usarComa, opciones).format(numero);
}

const Product = mongoose.model('Product', ProductSchequema);
module.exports = Product;