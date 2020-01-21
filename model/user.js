const mongoose  = require('mongoose')
const validator = require('validator')
const jwtKey = 'my_secret_key'
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');

const UserSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
    },
    role: {
            type: String,
            required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});
UserSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        return 'user not found';
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login 2')
    }

    return user
}

UserSchema.methods.newAuthToken = async function(){
    const user  = this
    const token =  jwt.sign({ _id: user.id.toString(), role: user.role }, jwtKey);
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

//hash the plain text password before saving
UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

const User = mongoose.model('users', UserSchema);

module.exports = User;