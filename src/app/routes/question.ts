import express from "express";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { CreateQuestion } from "../../core/usecases/question/CreateQuestion";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { GetAllQuestions } from "../../core/usecases/question/GetAllQuestions";
import { ApiQuestionMapper } from "../dtos/ApiQuestionMapper";
import { CreateQuestionSchema } from "../commands/question/CreateQuestionSchema";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const questionRouter = express.Router();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createQuestion = new CreateQuestion(mongoDbQuestionRepository, v4IdGateway);
const getAllQuestions = new GetAllQuestions(mongoDbQuestionRepository);
const apiQuestionMapper = new ApiQuestionMapper();

questionRouter.use(authorization);

questionRouter.post("/create", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      description: req.body.description,
      picture: req.body.picture,
    };

    const values = await CreateQuestionSchema.validateAsync(body);

    const question = await createQuestion.execute(values);

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

export { questionRouter };
