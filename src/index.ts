import 'reflect-metadata';
import "dotenv/config";
import express from "express";
import * as mongoose from "mongoose";
import morgan from "morgan";
import * as path from "path";
import {createPollTimer} from "./app/jobs";
import {createExpressServer, useContainer, useExpressServer} from "routing-controllers";
import {SchoolController} from "./app/controllers/SchoolController";
import {UserController} from "./app/controllers/UserController";
import {FriendsController} from "./app/controllers/FriendsController";
import {AnswerController} from './app/controllers/AnswerController';
import {PollController} from './app/controllers/Pollcontroller';
import {PovKernel} from './app/config/PovKernel';
import {FollowController} from "./app/controllers/FollowController";
import {QuestionController} from "./app/controllers/QuestionController";

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

app.get('/views/confirm', (req, res) => {
    return res.render('confirmPassword')
})

app.use(morgan('combined'));

app.use(express.json());

const container = new PovKernel()

container.init()

useContainer(container)

useExpressServer(app, {
    controllers: [FriendsController,
        AnswerController,
        PollController,
        SchoolController,
        UserController,
        FollowController,
        QuestionController
    ]
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
 

