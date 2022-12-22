import express from "express";
const cron = require("node-cron");
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {CreatePoll} from "../../core/usecases/poll/CreatePoll";
import {ApiPollMapper} from "../dtos/ApiPollMapper";
import {GetAllPolls} from "../../core/usecases/poll/GetAllPolls";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";


const pollRouter = express.Router();
const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createPoll = new CreatePoll(mongoDbPollRepository, mongoDbQuestionRepository, v4IdGateway)
const apiPollMapper = new ApiPollMapper()
const getAllPolls = new GetAllPolls(mongoDbPollRepository)

pollRouter.use(authorization)

cron.schedule('* */1 * * *', () => {
    pollRouter.post("/create", async (req: AuthentifiedRequest, res) => {
        try {
            const body = {
                numberOfQuestions: req.body.numberOfQuestions
            }
            await createPoll.execute(body);
            return res.sendStatus(201)
        } catch (err) {
            return res.status(400).send({
                message: "An error occurred"
            })
        }
    })
})

pollRouter.get("/all", async (req: AuthentifiedRequest, res) => {
    try {
        const polls = await getAllPolls.execute()
        return res.status(200).send(polls.map(elm => elm.props))
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

export {pollRouter}