import express from "express";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {MongoDbAnswerRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {MongoDbUserRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import {AnswerToQuestion} from "../../core/usecases/answer/AnswerToQuestion";
import {DeleteAnswer} from "../../core/usecases/answer/DeleteAnswer";
import {GetAllAnswers} from "../../core/usecases/answer/GetAllAnswers";
import {GetMyAnswers} from "../../core/usecases/answer/GetMyAnswers";
import {authorization} from "../middlewares/JwtAuthorizationMiddleware";
import {AuthentifiedRequest} from "../types/AuthentifiedRequest";
import {AnswerMarkAsRead} from "../../core/usecases/answer/AnswerMarkAsRead";
import {AnswerToQuestionCommands} from "../commands/answer/AnswerToQuestionCommands";
import {SchoolDbRepository} from "../../adapters/repositories/school/SchoolDbRepository";
import admin from "firebase-admin";
import { FirebaseGateway } from "../../adapters/gateways/FirebaseGateway";

const answerRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const schoolDbRepository = new SchoolDbRepository();
const v4IdGateway = new V4IdGateway();
const mongoDbAnswerRepository = new MongoDbAnswerRepository();
const googleCreadentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(
    Buffer.from(googleCreadentials, 'base64').toString('utf-8')
    );
const initialize = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const firebaseGateway = new FirebaseGateway(initialize)
const answerToQuestion = new AnswerToQuestion(mongoDbAnswerRepository, mongoDbUserRepository, mongoDbQuestionRepository, schoolDbRepository, v4IdGateway, firebaseGateway);
const getAllAnswers = new GetAllAnswers(mongoDbAnswerRepository);
const getMyAnswers = new GetMyAnswers(mongoDbAnswerRepository);
const deleteAnswer = new DeleteAnswer(mongoDbAnswerRepository);
const answerMarkAsRead = new AnswerMarkAsRead(mongoDbAnswerRepository);

answerRouter.use(authorization);

answerRouter.post("/", async (req: AuthentifiedRequest, res) => {
    const body = await AnswerToQuestionCommands.setProperties({
        questionId: req.body.questionId,
        friendId: req.body.friendId,
        userId: req.user.id,
        pollId: req.body.pollId,
    });

    const answer = await answerToQuestion.execute(body);

    return res.status(201).send(answer.props);
});

answerRouter.get("/all/:schoolId", async (req: AuthentifiedRequest, res) => {
    const answers = await getAllAnswers.execute({
        schoolId: req.params.schoolId,
        userId: req.user.id,
    });

    return res.status(200).send(answers.map(item => item.props));
});

answerRouter.get("/mine", async (req: AuthentifiedRequest, res) => {
    const friendAnswers = await getMyAnswers.execute(req.user.id);

    return res.status(200).send(friendAnswers.map(item => item.props));
});

answerRouter.delete("/:answerId", async (req, res) => {
    await deleteAnswer.execute(req.params.answerId);

    return res.sendStatus(200);
});

answerRouter.patch("/:answerId", async (req, res) => {
    await answerMarkAsRead.execute(req.params.answerId);

    return res.sendStatus(200);
});

export {answerRouter};
