const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const InvoiceSchequema = new mongoose.Schema({    
    OrderId:{
        type:ObjectId,
        ref:'Order'
    },
    address:{
        type: String,
        required: true
    },
},{    
    timestamps:true
});


const Invoice = mongoose.model('Invoice', InvoiceSchequema);
module.exports = Invoice;