const mongoose = require('mongoose');
const jwt  = require( 'jsonwebtoken');

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
        required:true
        },
    password:{
        type:String,
        required:true,
        minlength:8
        },
    roles: {
        type: String,
        enum: ['cliente', 'admin']
    },
    confirmed: Boolean,
    tokens: [String],
    orders: [{
        type: ObjectId,
        ref: 'Order'
    }]
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


UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, 'beCommTokenSystem', { expiresIn: '2y' });
    return token;
}

module.exports = mongoose.model('User', UserSchema);