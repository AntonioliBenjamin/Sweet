import express from "express";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { AnswerToQuestion } from "../../core/usecases/answer/AnswerToQuestion";
import { GetAllAnswers } from "../../core/usecases/answer/GetAllAnswers";
import { GetFriendAnswers } from "../../core/usecases/answer/GetFriendAnswers";
import { GetMyAnswers } from "../../core/usecases/answer/GetMyAnswers";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const answerRouter = express.Router();
const v4IdGateway = new V4IdGateway();
const mongoDbAnswerRepository = new MongoDbAnswerRepository()
const answerToQuestion = new AnswerToQuestion(mongoDbAnswerRepository, v4IdGateway)
const getAllAnswers = new GetAllAnswers(mongoDbAnswerRepository)
const getFriendAnswers = new GetFriendAnswers(mongoDbAnswerRepository)
const getMyAnswers = new GetMyAnswers(mongoDbAnswerRepository)


answerRouter.use(authorization);

answerRouter.post("/", async (req, res) => {
    try {          
    const body = {
        question: req.body.question,
        response: req.body.response,
        answer: req.body.answer
    }

    const answer = await answerToQuestion.execute({
        question: body.question,
        response: body.response,
        answer: body.answer
    })

    return res.status(201).send(answer.props)

    } catch (err) {
        console.error(err);
        return res.status(400).send({
          message: "An error occurred",
        });
    }
})

answerRouter.get("/all", async (req, res) => {
    try {
        const answers = await getAllAnswers.execute() 

        return res.status(200).send(answers)
    } catch (err) {
        console.error(err);
        return res.status(400).send({
          message: "An error occurred",
        });
    }
})

answerRouter.get("/friend/:id", async (req, res) => {
    try {
        const friendAnswers = await getFriendAnswers.execute(req.params.id) 

        return res.status(200).send(friendAnswers)
    } catch (err) {
        console.error(err);
        return res.status(400).send({
          message: "An error occurred",
        });
    }
})

answerRouter.get("/mine", async (req: AuthentifiedRequest, res) => {
    try {
        const friendAnswers = await getMyAnswers.execute(req.user.id) 

        return res.status(200).send(friendAnswers)
    } catch (err) {
        console.error(err);
        return res.status(400).send({
          message: "An error occurred",
        });
    }
})


export { answerRouter }