import 'reflect-metadata';
import "dotenv/config";
import express from "express";
import * as mongoose from "mongoose";
import {followRouter} from "./app/routes/follow";
import {schoolRouter} from "./app/routes/school";
import {userRouter} from "./app/routes/user";
import {questionRouter} from "./app/routes/question";
import morgan from "morgan";
import * as path from "path";
import {createPollTimer} from "./app/jobs";
import { useExpressServer } from 'routing-controllers';
import { FriendsController } from "./app/controllers/FriendsController"; 
import { createExpressServer } from 'routing-controllers';
import { AnswerController } from './app/controllers/AnswerController';
import { PollController } from './app/controllers/Pollcontroller';

const app = createExpressServer({
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204,
      paramOptions: {
        required: false,
      },
    },
  });

const MONGODB_URL = process.env.MONGODB_URL


const port = +process.env.PORT;

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URL, (err) => {
    if (err) {
        throw err;
    }
    console.info("Connected to mongodb");
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './app/views'))

app.get('/views/reset', (req, res) => {
    return res.render('index')
})

app.use(morgan('combined'));

app.use(express.json());

app.get('/status', (req, res) => {
    throw new Error('Not implemented')
})

app.use("/user", userRouter);

app.use("/school", schoolRouter);

app.use("/follow", followRouter);

app.use("/question", questionRouter);

useExpressServer( app, {
    controllers: [FriendsController, AnswerController, PollController],
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        console.error(err)
        return next(err)
    }
    console.error(err)
    res.status(400).send(err)
});

createPollTimer.start();

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
 

