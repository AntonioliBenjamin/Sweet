import express from "express";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { CreateQuestion } from "../../core/usecases/question/CreateQuestion";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { GetAllQuestions } from "../../core/usecases/question/GetAllQuestions";
import { ApiQuestionMapper } from "../dtos/ApiQuestionMapper";
import { CreateQuestionCommands } from "../commands/question/CreateQuestionCommands";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
import { DeleteQuestion } from "../../core/usecases/question/DeleteQuestion";
import { transformAndValidate } from "class-transformer-validator";
import { clientErrorHandler } from "../middlewares/errorClientHandler";
const questionRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createQuestion = new CreateQuestion(mongoDbQuestionRepository, v4IdGateway);
const getAllQuestions = new GetAllQuestions(mongoDbQuestionRepository);
const apiQuestionMapper = new ApiQuestionMapper();
const deleteQuestion = new DeleteQuestion(mongoDbQuestionRepository)

questionRouter.use(authorization);



questionRouter.post("/",  async (req: AuthentifiedRequest, res) => {
    await transformAndValidate(CreateQuestionCommands, req.body) 
    const question = await createQuestion.execute(req.body);
    return res.status(201).send(apiQuestionMapper.fromDomain(question));
});

questionRouter.get("/all",  async (req: AuthentifiedRequest, res) => {
    const questions = await getAllQuestions.execute();
    return await res.status(200).send(questions.map((elm) => elm.props));
})

questionRouter.delete("/:questionId",  async (req, res) => {
    await deleteQuestion.execute(req.params.questionId)
    return res.sendStatus(200)
});

questionRouter.use(clientErrorHandler)

export { questionRouter };