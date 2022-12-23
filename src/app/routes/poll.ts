import express from "express";
import cron from "node-cron";
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {CreatePoll} from "../../core/usecases/poll/CreatePoll";
import {ApiPollMapper} from "../dtos/ApiPollMapper";
import {GetAllPolls} from "../../core/usecases/poll/GetAllPolls";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {GetCurrentPoll} from "../../core/usecases/poll/GetCurrentPoll";
const pollRouter = express.Router();
const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createPoll = new CreatePoll(mongoDbPollRepository, mongoDbQuestionRepository, v4IdGateway);
const apiPollMapper = new ApiPollMapper();
const getAllPolls = new GetAllPolls(mongoDbPollRepository);
const getCurrentPoll = new GetCurrentPoll(mongoDbPollRepository)

pollRouter.use(authorization);


    pollRouter.post("/", async (req: AuthentifiedRequest, res) => {
        try {
            await createPoll.execute();

            return res.sendStatus(201);

        } catch (err) {

            return res.status(400).send({
                message: "An error occurred"
            })
        }
    })


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

pollRouter.get("/curent", async (req: AuthentifiedRequest, res) => {
    try {
        const currentPoll = await getCurrentPoll.execute();

        return res.status(200).send(currentPoll);

    } catch (err) {

        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

export {pollRouter};