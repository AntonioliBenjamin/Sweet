import "dotenv/config";
import express from "express";
import * as mongoose from "mongoose";
import { friendShipRouter } from "./app/routes/friendShip";
import { schoolRouter } from "./app/routes/school";
import {userRouter} from "./app/routes/user";

const port = +process.env.PORT_KEY;

mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/weather_server_data", (err) => {
    if (err) {
        throw err;
    }
    console.info("Connected to mongodb");
});

const app = express();

app.use(express.json());

app.use("/", userRouter);

app.use("/school", schoolRouter);

app.use("/friend", friendShipRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
