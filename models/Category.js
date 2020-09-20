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
},{
    toJSON: {
        transform: function(doc, ret) {
           // delete ret.products;
            return ret;
        }
    } 
});

// CategorySchequema.pre('save', function (next) {
//     let prodUniques="";
//     prodUniques = _.uniq(this.products);

//     console.log(prodUniques);

//     Category.find({ products: { $in: product._id }})
//     .then((res) => {
//         res.forEach((item) => {            
//             console.log("item db:",item);
//             prodUniques =  prodUniques.splice(prodUniques.indexOf(item._id), 1);
//         })       
//     })
//     .catch(error => {
//         console.error(error);
//        // res.status(500).send(error);
//     });

//     console.log(prodUniques);
//     this.products = prodUniques
//     next();
//   });

 

const Category = mongoose.model('Category', CategorySchequema);
module.exports = Category;