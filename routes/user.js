import express from "express";
import {User} from "../db/user.js";
import bcrypt from "bcrypt";

const userRouter = new express.Router();

userRouter.post('/user/signup', async (req, res) => {

    const user = new User(req.body);
    const response = await user.save();

    if(!response){
        res.status(500).send("500 Internal Server Error");
    }else{
        res.send("Request successful");
    }
    
});


userRouter.post('/user/login', async (req, res) => {

    const loginSuccess = await User.findByCredential(req.body.name, req.body.password);

    if(loginSuccess){
        res.send("Login successful");
    }else{
        res.send("Login failed");
    }

});


userRouter.get("/users", async (req, res)=> {
    const response = await User.find();
    console.log(response);
    res.send(response);
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