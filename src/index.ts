import "dotenv/config";
import express from "express";
import * as mongoose from "mongoose";
import {answerRouter} from "./app/routes/answer";
import {followRouter} from "./app/routes/follow";
import {questionRouter} from "./app/routes/question";
import {pollRouter} from "./app/routes/poll";
import morgan from "morgan";
import * as path from "path";
import {friendsRouter} from "./app/routes/friends";
import {createPollTimer} from "./app/jobs";
import {createExpressServer, useExpressServer} from "routing-controllers";
import {SchoolController} from "./app/controllers/SchoolController";
import {UserController} from "./app/controllers/UserController";

const MONGODB_URL = process.env.MONGODB_URL

const port = +process.env.PORT;

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URL, (err) => {
    if (err) {
        throw err;
    }
    console.info("Connected to mongodb");
});


const app = createExpressServer({
    defaults: {
        nullResultCode: 404,
        undefinedResultCode: 204,
        paramOptions: {
            required: false,
        },
    },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './app/views'))

app.get('/views/reset', (req, res) => {
    return res.render('index')
})

app.use(morgan('combined'));

app.use(express.json());

app.use("/follow", followRouter);

app.use("/question", questionRouter);

app.use("/poll", pollRouter);

app.use("/answer", answerRouter);

app.use("/friends", friendsRouter);

useExpressServer(app, {
    controllers: [SchoolController,UserController],
});

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
 

