import express from "express";
import {authorization} from '../middlewares/JwtAuthorizationMiddleware';
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {CreateQuestion} from "../../core/usecases/question/CreateQuestion";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";
import {GetAllQuestions} from "../../core/usecases/question/GetAllQuestions";
import {ApiQuestionMapper} from "../dtos/ApiQuestionMapper";

const questionRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createQuestion = new CreateQuestion(mongoDbQuestionRepository, v4IdGateway);
const getAllQuestions = new GetAllQuestions(mongoDbQuestionRepository);
const apiQuestionMapper = new ApiQuestionMapper()

//questionRouter.use(authorization)

questionRouter.post("/create", async (req, res) => {
    try {
        const body = {
            description: req.body.description,
            picture: req.body.picture
        };

        const question = await createQuestion.execute(body)
        return res.status(201).send(apiQuestionMapper.fromDomain(question))
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

questionRouter.get("/all", async (req, res) => {
    try {
        const questions = await getAllQuestions.execute()
        return res.status(200).send(questions.map(elm => elm.props))
    } catch (err) {
        return res.status(400).send({
            message: "An error occurred"
        })
    }
})

export {questionRouter}