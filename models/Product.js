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
    timestamps: true    
});

// Actualizo directamente el precio sin IVA a partir del precio final, con IVA, y el porcentaje de IVA
ProductSchequema.pre('save', async function(next) {
    try {
        const producto = this;
       // producto.price_VAT = producto.price_wo_VAT + (producto.price_wo_VAT * producto.VAT / 100);
        producto.price_wo_VAT = parseFloat(intlRound(producto.price_VAT / ((producto.VAT / 100) + 1)));
        //console.log(price_VAT, producto.price_wo_VAT);
    } catch (error) {
        console.error(error);
    } finally {
        next();
    }
})  

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