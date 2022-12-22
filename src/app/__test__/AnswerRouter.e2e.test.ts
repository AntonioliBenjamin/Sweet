import "dotenv/config";
import { sign } from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import supertest from "supertest";
import { AnswerModel } from "../../adapters/repositories/mongoDb/models/answer";
import { MongoDbAnswerRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { Answer } from "../../core/Entities/Answer";
import { AnswerRepository } from "../../core/repositories/AnswerRepository";
import { answerRouter } from "../routes/answer";
import { Gender, User } from "../../core/Entities/User";
import { v4 } from "uuid";
import { UserRepository } from "../../core/repositories/UserRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { UserModel } from "../../adapters/repositories/mongoDb/models/user";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { QuestionRepository } from "../../core/repositories/QuestionRepository";
import { Question } from "../../core/Entities/Question";

const app = express();

describe("E2E - FriendShipRouter", () => {
  let accessKey;
  let answerRepository: AnswerRepository;
  let userRepository: UserRepository;
  let answer: Answer;
  let answer2: Answer;
  let questionRepository: QuestionRepository;
  let question: Question;

  beforeAll(() => {
    answerRepository = new MongoDbAnswerRepository();
    userRepository = new MongoDbUserRepository();

    app.use(express.json());
    app.use("/answer", answerRouter);

    const databaseId = v4();
    mongoose.set("strictQuery", false);
    mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
      if (err) {
        throw err;
      }
      console.info("Connected to mongodb");
    });

    questionRepository = new MongoDbQuestionRepository();
    question = Question.create({
      questionId: "9999",
      description: "yes",
      picture: "http://yes",
    });

    answer = new Answer({
      answerId: "1234",
      question: {
        questionId: "9999",
        description: "this is a desc",
        picture: "http://pic",
      },
      response: {
        userId: "8888",
        firstName: "name",
        lastName: "lastname",
        userName: "username",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
        section: "1er L",
        gender: Gender.GIRL,
      },
      answer: "9999",
      createdAt: new Date(),
    });

    answer2 = new Answer({
      answerId: "4321",
      question: {
        questionId: "1111",
        description: "this is a desc",
        picture: "http://pic",
      },
      response: {
        userId: "8888",
        firstName: "name",
        lastName: "lastname",
        userName: "username",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
        section: "1er L",
        gender: Gender.GIRL,
      },
      answer: "9999",
      createdAt: new Date(),
    });
  });

  beforeEach(async () => {
    await answerRepository.create(answer);
    await answerRepository.create(answer2);
  });

  afterEach(async () => {
    await AnswerModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should post/answer", async () => {
    await questionRepository.create(question);

    const user = new User({
      email: "user@example.com",
      id: "123456",
      password: "password",
      userName: "user Name",
      age: 15,
      firstName: "michou",
      gender: Gender.BOY,
      lastName: "papito",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
      recoveryCode: null,
    });
    await userRepository.create(user);

    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .post("/answer/9999")
      .set("access_key", accessKey)
      .send({
        userId: "123456",
        answerUserId: "9999",
      })
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody.answerId).toBeTruthy();
      })
      .expect(201);

    await UserModel.collection.drop();
  });

  it("should get all answers", async () => {
    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .get("/answer/all")
      .set("access_key", accessKey)
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(2);
      })
      .expect(200);
  });

  it("should get/answer/all", async () => {
    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .get("/answer/follow/9999")
      .set("access_key", accessKey)
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(2);
      })
      .expect(200);
  });

  it("should get/answer/mine", async () => {
    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .get("/answer/mine")
      .set("access_key", accessKey)
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody).toHaveLength(2);
      })
      .expect(200);
  });

  it("should delete/answer", async () => {
    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .delete("/answer")
      .set("access_key", accessKey)
      .send({
        answerId: "1234",
      })
      .expect(200);
  });
});
