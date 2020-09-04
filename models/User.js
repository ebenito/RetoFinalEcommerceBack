const mongoose = require('mongoose');
const jwt  = require( 'jsonwebtoken');
require('dotenv').config();

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    name:String,    
    username: {
        type: String,
        unique: true,
    },
    email:{
        type:String,
        unique:true,
        required:true, 
        set: toLower
        },
    password:{
        type:String,
        required:true,
        minlength:8
        },
    rol: {
        type: String,
        enum: ['cliente', 'vendedor', 'admin']
    },
    confirmed: Boolean,
    tokens: [String],    
    ordersId: [{
        type: ObjectId,
        ref: 'Order'
    }],
},{
    timestamps:true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.tokens;
            delete ret.password;
            return ret;
        }
    }
});

function toLower(v) {
    return v.toLowerCase();
  }

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '2y' });
    return token;
}

module.exports = mongoose.model('User', UserSchema);