import express from "express";
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {CreatePoll} from "../../core/usecases/poll/CreatePoll";
import {ApiPollMapper} from "../dtos/ApiPollMapper";
import {GetAllPolls} from "../../core/usecases/poll/GetAllPolls";
import {AddQuestionToPoll} from "../../core/usecases/poll/AddQuestionToPoll";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {AddQuestionToPollSchema} from "../commands/poll/AddQuestionToPollSchema";

const pollRouter = express.Router();
const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbQuestionRepository = new MongoDbQuestionRepository()
const v4IdGateway = new V4IdGateway();
const createPoll = new CreatePoll(mongoDbPollRepository,v4IdGateway)
const apiPollMapper = new ApiPollMapper()
const getAllPolls = new GetAllPolls(mongoDbPollRepository)
const addQuestionToPoll = new AddQuestionToPoll(mongoDbPollRepository,mongoDbQuestionRepository)

pollRouter.use(authorization)

pollRouter.post("/create", async (req: AuthentifiedRequest, res) => {
    try {
        await createPoll.execute();
        return res.status(201).send()
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

pollRouter.get("/all", async (req : AuthentifiedRequest, res) => {
    try {
        const polls = await getAllPolls.execute()
        return res.status(200).send(polls.map(elm => elm.props))
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

pollRouter.post("/add/question", async (req: AuthentifiedRequest, res) => {
    try {
        const body = {
            pollId: req.body.pollId,
            questionId: req.body.questionId,
        };
        const values = await AddQuestionToPollSchema.validateAsync(body);
        const poll = await addQuestionToPoll.execute(values)
        return res.status(200).send(apiPollMapper.fromDomain(poll))
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})




export {pollRouter}