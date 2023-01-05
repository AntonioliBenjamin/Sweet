import express from "express";
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {GetAllPolls} from "../../core/usecases/poll/GetAllPolls";
import {GetCurrentPoll} from "../../core/usecases/poll/GetCurrentPoll";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { PollApiMapper } from "../dtos/PollApiMapper";
import { GetLastQuestionAnswered } from "../../core/usecases/answer/GetLastQuestionAnswered";
const pollRouter = express.Router();
const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbAnswerRepository = new MongoDbAnswerRepository()
const getAllPolls = new GetAllPolls(mongoDbPollRepository);
const getCurrentPoll = new GetCurrentPoll(mongoDbPollRepository)
const pollApimapper = new PollApiMapper()
const lastQuestionAnswered = new GetLastQuestionAnswered(mongoDbAnswerRepository)

pollRouter.use(authorization);

pollRouter.get("/all", async (req: AuthentifiedRequest, res) => {
    try {
        const polls = await getAllPolls.execute();

        return res.status(200).send(polls.map(elm => elm.props));

    } catch (err) {
        console.error(err)
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

pollRouter.get("/current", async (req: AuthentifiedRequest, res) => {
    try {
        const currentPoll = await getCurrentPoll.execute();
        
        const lastAnswer = await lastQuestionAnswered.execute({
            pollId: currentPoll.props.pollId,
            userId: req.user.id
        })

        const pollApiResponse = pollApimapper.fromDomain(currentPoll, lastAnswer)

        return res.status(200).send(pollApiResponse);

    } catch (err) {
        console.error(err)
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

export {pollRouter};