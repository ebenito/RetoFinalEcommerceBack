const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchequema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:String,
    price_wo_VAT: {
        type:Number,
        required : [true, 'Debe indicar el precio SIN IVA']
    },
    price_VAT: {
        type:Number,
        required : [false, 'Debe indicar el precio CON IVA']
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
    userId:[{
        type: ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true    
})

// Actualizo directamente el precio con IVA a partir del precio sin IVA y el porcentaje de IVA
ProductSchequema.pre('save', async function(next) {
    try {
        const producto = this;
        producto.price_VAT = producto.price_wo_VAT + (producto.price_wo_VAT * producto.VAT / 100);
    } catch (error) {
        console.error(error);
    } finally {
        next();
    }
})  

const Product = mongoose.model('Product', ProductSchequema);
module.exports = Product;