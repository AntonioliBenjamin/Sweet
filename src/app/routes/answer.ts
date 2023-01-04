import express from "express";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {MongoDbAnswerRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {AnswerToQuestion} from "../../core/usecases/answer/AnswerToQuestion";
import {DeleteAnswer} from "../../core/usecases/answer/DeleteAnswer";
import {GetAllAnswers} from "../../core/usecases/answer/GetAllAnswers";
import {GetFriendAnswers} from "../../core/usecases/answer/GetFriendAnswers";
import {GetMyAnswers} from "../../core/usecases/answer/GetMyAnswers";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {AnswerMarkAsRead} from "../../core/usecases/answer/AnswerMarkAsRead";
import { AnswerToQuestionCommands } from "../commands/answer/AnswerToQuestionCommands";
import { validateOrReject, validate } from 'class-validator';
import { commandsValidation } from "../commands/CommandsValidation";
const answerRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const v4IdGateway = new V4IdGateway();
const mongoDbAnswerRepository = new MongoDbAnswerRepository();
const answerToQuestion = new AnswerToQuestion(mongoDbAnswerRepository,mongoDbUserRepository,mongoDbQuestionRepository,v4IdGateway);
const getAllAnswers = new GetAllAnswers(mongoDbAnswerRepository);
const getFriendAnswers = new GetFriendAnswers(mongoDbAnswerRepository);
const getMyAnswers = new GetMyAnswers(mongoDbAnswerRepository);
const deleteAnswer = new DeleteAnswer(mongoDbAnswerRepository);
const answerMarkAsRead = new AnswerMarkAsRead(mongoDbAnswerRepository)

answerRouter.use(authorization);

answerRouter.post("/", async (req: AuthentifiedRequest, res) => {
    try {
        const body = new AnswerToQuestionCommands()
        body.questionId = req.body.questionId;
        body.friendId = req.body.friendId;
        body.userId = req.user.id;
        body.pollId = req.body.pollId;
        
        await commandsValidation(body)

        const answer = await answerToQuestion.execute(body)
         

        return res.status(201).send(answer.props);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

answerRouter.get("/all", async (req, res) => {
    try {
        const answers = await getAllAnswers.execute();

        return res.status(200).send(answers);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

answerRouter.get("/friend/:id", async (req, res) => {
    try {
        const friendAnswers = await getFriendAnswers.execute(req.params.id);

        return res.status(200).send(friendAnswers);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

answerRouter.get("/mine", async (req: AuthentifiedRequest, res) => {
    try {
        const friendAnswers = await getMyAnswers.execute(req.user.id);

        return res.status(200).send(friendAnswers);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

answerRouter.delete("/:answerId", async (req, res) => {
    try {

        await deleteAnswer.execute(req.params.answerId);

        return res.sendStatus(200);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})

answerRouter.patch("/:answerId", async (req, res) => {
    try {
        await answerMarkAsRead.execute(req.params.answerId);

        return res.sendStatus(200);

    } catch (err) {
        console.error(err);

        return res.status(400).send({
            message: "An error occurred",
        });
    }
})


export {answerRouter};