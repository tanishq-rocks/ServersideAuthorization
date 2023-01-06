import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import secret from "../config/jwt.json" assert { type: "json" };

mongoose.connect('mongodb://127.0.0.1:27017/test');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    }
})

// Before saving user info to db we want to encrypt password
UserSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

// Verfying the user during sign in
UserSchema.statics.findByCredential = async (name, password) => {
    const user = await User.find({name: name}).exec();
    let isMatch = await bcrypt.compare(password, user[0].password);
    // console.log("isMath", isMatch);
    if(isMatch){
        return user[0];
    }else{
        throw new Error();
    }
};

// while signup or sign in we need to generate token
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    return await jwt.sign({_id: user._id}, secret.key);
}

// For hiding user sensitive information
UserSchema.methods.toJson = async function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject._id;

    return userObject;
}

const User = mongoose.model('User', UserSchema);

export {User};