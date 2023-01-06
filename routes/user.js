import express from "express";
import {User} from "../db/user.js";
import {auth} from "../auth/auth.js";

const userRouter = new express.Router();

userRouter.post('/user/signup', async (req, res) => {

    try {
        const user = new User(req.body);    
        const response = await user.save();
        const token = await response.generateAuthToken();
        res.json({
            token
        });   
    } catch (error) {
        res.status(500).send("Signup Failed - Internal Server Error")
    }
    
});


userRouter.post('/user/login', async (req, res) => {

    try {
        const user = await User.findByCredential(req.body.name, req.body.password);
        const token = await user.generateAuthToken();
        // console.log("user",user._id);
        // console.log("token : ",token);
        res.json({
            token
        });

    } catch (error) {
        res.status(404).send("Login failed");
    }


});


userRouter.get("/users", auth, async (req, res)=> {
    console.log("Authenticated user : ", await req.user.toJson());
    const response = await User.find();
    let allUsers = [];
    for (let i = 0; i < response.length; i++) {
        const userObject = response[i];
        allUsers.push(await userObject.toJson());
    }
    res.send(allUsers);
})

userRouter.get('/users/:id', async (req, res) => {
    // console.log(req.params);
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user){
            res.status(404).send("404 Not found");
        }else{
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("500 Internal Server Error");
    }
})

export {userRouter};