import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

UserSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

UserSchema.statics.findByCredential = async (name, password) => {
    const user = await User.find({name: name}).exec();
    return await bcrypt.compare(password, user[0].password);
};

const User = mongoose.model('User', UserSchema);

export {User};