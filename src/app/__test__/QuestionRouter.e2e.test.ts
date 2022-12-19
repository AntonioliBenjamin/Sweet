import "dotenv/config";
import supertest from 'supertest';
import mongoose from 'mongoose';
import express from "express";
import {v4} from "uuid";
import {questionRouter} from "../routes/question";
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {Question} from "../../core/Entities/Question";
import {QuestionModel} from "../../adapters/repositories/mongoDb/models/question";
import {sign} from "jsonwebtoken";
const app = express();

describe("E2E - Question Router", () => {
    let accessKey;
    let questionRepository: QuestionRepository;
    let question: Question;

    beforeAll(async () => {
        app.use(express.json());
        app.use("/question", questionRouter);

        const databaseId = v4();
        mongoose.set('strictQuery', false)
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });
        questionRepository = new MongoDbQuestionRepository();
        question = Question.create({
            questionId: "1234",
            description: "yes",
            picture: "http://yes"
        });

    });

    afterEach(async () => {
        await QuestionModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should post/question/create", async () => {

        accessKey = sign(
            {
                id:"1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .post("/question/create")
            .set("access_key", accessKey)
            .send({
                description: "yes",
                picture: "http://yes"
            })

            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.description).toEqual("yes");
                expect(responseBody.questionId).toBeTruthy();
            })
            .expect(201);
    });

    it("Should get/question/all", async () => {
        await questionRepository.create(question);

        accessKey = sign(
            {
                id:"1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );
        await supertest(app)
            .get("/question/all")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody).toHaveLength(1);
            })
            .expect(200);
    });
});




