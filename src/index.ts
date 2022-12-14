import "dotenv/config";
import express from "express";
import * as mongoose from "mongoose";
import {userRouter} from "./app/routes/user";

const port = +process.env.PORT_KEY;

mongoose.connect("mongodb://127.0.0.1:27017/weather_server_data", (err) => {
    if (err) {
        throw err;
    }
    console.info("Connected to mongodb");
});

const app = express();

app.use(express.json());

app.use("/", userRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
