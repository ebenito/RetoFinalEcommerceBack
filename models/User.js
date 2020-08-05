const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchequema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        required:true
        },
    password:{
        type:String,
        required:true,
        minlength:8
        },
    confirmed: Boolean,
    tokens: [String],
    orders: [{
        type: ObjectId,
        ref: 'Order'
    }]
},{timestamps:true});

module.exports = mongoose.model('User', userSchequema);
