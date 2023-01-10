import 'reflect-metadata';
import { Param, Get, Post, Res, Body, UseBefore, Req, JsonController, Delete, Patch } from "routing-controllers";
import admin from "firebase-admin";
import { Response } from "express";
import { AnswerMarkAsRead } from "../../core/usecases/answer/AnswerMarkAsRead";
import { DeleteAnswer } from "../../core/usecases/answer/DeleteAnswer";
import { GetMyAnswers } from "../../core/usecases/answer/GetMyAnswers";
import { GetAllAnswers } from "../../core/usecases/answer/GetAllAnswers";
import { AnswerToQuestion } from "../../core/usecases/answer/AnswerToQuestion";
import { FirebaseGateway } from "../../adapters/gateways/FirebaseGateway";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { SchoolDbRepository } from "../../adapters/repositories/school/SchoolDbRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { AnswerToQuestionCommands } from "../commands/answer/AnswerToQuestionCommands";
import { authorization } from "../middlewares/JwtAuthorizationMiddleware";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";

const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const mongoDbUserRepository = new MongoDbUserRepository();
const schoolDbRepository = new SchoolDbRepository();
const v4IdGateway = new V4IdGateway();
const mongoDbAnswerRepository = new MongoDbAnswerRepository();
const googleCreadentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(Buffer.from(googleCreadentials, 'base64').toString('utf-8'));
const initialize = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const firebaseGateway = new FirebaseGateway(initialize)
const answerToQuestion = new AnswerToQuestion(mongoDbAnswerRepository, mongoDbUserRepository, mongoDbQuestionRepository, schoolDbRepository, v4IdGateway, firebaseGateway);
const getAllAnswers = new GetAllAnswers(mongoDbAnswerRepository);
const getMyAnswers = new GetMyAnswers(mongoDbAnswerRepository);
const deleteAnswer = new DeleteAnswer(mongoDbAnswerRepository);
const answerMarkAsRead = new AnswerMarkAsRead(mongoDbAnswerRepository);


@JsonController('/answer')
@UseBefore(authorization)
export class AnswerController {

  @Post()
  async answerToQuestion(
    @Res() res: Response,
    @Body() cmd: AnswerToQuestionCommands) {

    const body = await AnswerToQuestionCommands.setProperties(cmd)
    const answer = await answerToQuestion.execute(body)
    return res.status(201).send(answer.props);
  }
  
  @Get('/all/:schoolId')
  async getAllAnswers(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("schoolId") schoolId: string
  ) {

    const answers = await getAllAnswers.execute({
        schoolId: schoolId,
        userId: req.user.id,
    });

    return res.status(200).send(answers.map(item => item.props));
  }

  @Get('/mine')
  async getMyAnswers(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response
  ) {
    const answers = await getMyAnswers.execute(req.user.id)

    return res.status(200).send(answers.map(item => item.props));
  }
  
  @Delete('/:answerId')
  async deleteAnswer(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param("answerId") answerId: string
  ) {

    await deleteAnswer.execute(answerId);

    return res.sendStatus(200);
  }

  @Patch('/:answerId')
  async answerMarkAsRead(
    @Res() res: Response,
    @Param("answerId") answerId: string
  ) {

    await answerMarkAsRead.execute(answerId);

    return res.sendStatus(200);
  }
}
