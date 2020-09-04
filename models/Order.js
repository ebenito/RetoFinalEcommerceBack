const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const OrderSchequema = new mongoose.Schema({
    products: [{
        _id: {
            type: ObjectId,
            ref: 'Product'
        },
        cantidad: Number
    }],
    userId: {
        type: ObjectId,
        ref: 'User'        
    },
    status: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date
    }
},{
    timestamps: true    
});


const Order = mongoose.model('Order', OrderSchequema);
module.exports = Order;