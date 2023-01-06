import jwt from "jsonwebtoken";
import secret from "../config/jwt.json" assert { type: "json" };
import {User} from "../db/user.js"

// console.log(data.secret); 
let auth = async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = await jwt.verify(token, secret.key);
        const user = await User.findOne({ _id: decoded._id});
        // console.log("decoded", decoded);
        // console.log("user from db", user);
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        res.status(404).send("Please authenticate");
    }
};

export {auth};