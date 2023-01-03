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
const questionRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createQuestion = new CreateQuestion(mongoDbQuestionRepository, v4IdGateway);
const getAllQuestions = new GetAllQuestions(mongoDbQuestionRepository);
const apiQuestionMapper = new ApiQuestionMapper();
const deleteQuestion = new DeleteQuestion(mongoDbQuestionRepository)

questionRouter.use(authorization);

questionRouter.post("/", async (req: AuthentifiedRequest, res) => {
  try {
    await transformAndValidate(CreateQuestionCommands, req.body) 
    
    const question = await createQuestion.execute(req.body);

    return res.status(201).send(apiQuestionMapper.fromDomain(question));
  } catch (err) {
    console.error(err);

    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

questionRouter.get("/all", async (req: AuthentifiedRequest, res) => {
  try {
    const questions = await getAllQuestions.execute();

    return res.status(200).send(questions.map((elm) => elm.props));

  } catch (err) {
    console.error(err);
    
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

questionRouter.delete("/:questionId", async (req, res) => {
  try {

    await deleteQuestion.execute(req.params.questionId)

    return res.sendStatus(200)
  } catch (err) {
    console.error(err);
    
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

export { questionRouter };
