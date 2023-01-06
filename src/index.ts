import "dotenv/config";
import express, {request} from "express";
import * as mongoose from "mongoose";
import {answerRouter} from "./app/routes/answer";
import {followRouter} from "./app/routes/follow";
import {schoolRouter} from "./app/routes/school";
import {userRouter} from "./app/routes/user";
import {questionRouter} from "./app/routes/question";
import {pollRouter} from "./app/routes/poll";
import morgan from "morgan";
import * as path from "path";
import {friendsRouter} from "./app/routes/friends";
import {createPollTimer} from "./app/jobs";

const port = +process.env.PORT;

mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/sweet", (err) => {
    if (err) {
        throw err;
    }
    console.info("Connected to mongodb");
});

const app = express();

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

app.use("/poll", pollRouter);

app.use("/answer", answerRouter);

app.use("/friends", friendsRouter);

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
 

