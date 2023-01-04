import express, {ErrorRequestHandler} from "express";
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {GetAllPolls} from "../../core/usecases/poll/GetAllPolls";
import {GetCurrentPoll} from "../../core/usecases/poll/GetCurrentPoll";
import {schoolRouter} from "./school";
const pollRouter = express.Router();
const mongoDbPollRepository = new MongoDbPollRepository();
const getAllPolls = new GetAllPolls(mongoDbPollRepository);
const getCurrentPoll = new GetCurrentPoll(mongoDbPollRepository)

pollRouter.use(authorization);

pollRouter.get("/all", async (req: AuthentifiedRequest, res) => {
    try {
        const polls = await getAllPolls.execute();

        return res.status(200).send(polls.map(elm => elm.props));

    } catch (err) {

        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

pollRouter.get("/current", async (req: AuthentifiedRequest, res) => {
    try {
        const currentPoll = await getCurrentPoll.execute();

        return res.status(200).send(currentPoll);

    } catch (err) {

        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {};

schoolRouter.use(errorHandler);

export {pollRouter};