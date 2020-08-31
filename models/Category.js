const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CategorySchequema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    products:[{
        type:ObjectId,
        ref:'Product'
    }]
});

const Category = mongoose.model('Category', CategorySchequema);
module.exports = Category;