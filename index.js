import express from "express";
import { userRouter } from "./routes/user.js";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(userRouter);
app.listen(port, () => {
    console.log(`App is listening on the port : ${port}`);
})