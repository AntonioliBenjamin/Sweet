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
import { Gender } from "../../core/Entities/User";
import { v4 } from "uuid";

const app = express();

describe("E2E - FriendShipRouter", () => {
  let accessKey;
  let answerRepository: AnswerRepository;
  let answer: Answer;
  let answer2: Answer;

  beforeAll(() => {
    answerRepository = new MongoDbAnswerRepository();

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
    accessKey = sign(
      {
        id: "9999",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
      },
      "maytheforcebewithyou"
    );

    await supertest(app)
      .post("/answer")
      .set("access_key", accessKey)
      .send({
        question: {
          questionId: "1234",
          description: "yes",
          picture: "http://yes",
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
      })
      .expect((response) => {
        const responseBody = response.body;
        expect(responseBody.answerId).toBeTruthy();
      })
      .expect(201);
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

  it("should get all follow answers", async () => {
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

  it("should get all my answers", async () => {
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
});
