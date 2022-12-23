import "dotenv/config";
import supertest from 'supertest';
import mongoose from 'mongoose';
import express from "express";
import {v4} from "uuid";
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {Question} from "../../core/Entities/Question";
import {sign} from "jsonwebtoken";
import {PollRepository} from "../../core/repositories/PollRepository";
import {Poll} from "../../core/Entities/Poll";
import {pollRouter} from "../routes/poll";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {PollModel} from "../../adapters/repositories/mongoDb/models/poll";
import {questionMongoFixtures} from "../../core/fixtures/questionMongoFixtures";

const app = express();

describe("E2E - Poll Router", () => {
    let accessKey;
    let questionRepository: QuestionRepository;
    let question: Question;
    let pollRepository: PollRepository;
    let poll: Poll;
    let poll2: Poll

    beforeAll(async () => {
        questionRepository = new MongoDbQuestionRepository();
        pollRepository = new MongoDbPollRepository();
        app.use(express.json());
        app.use("/poll", pollRouter);

        const databaseId = v4();
        mongoose.set('strictQuery', false)
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });

        poll = Poll.create({
            pollId: "5678"
        })

        poll2 = new Poll({
            pollId: "0000",
            createdAt: new Date(1),
            expirationDate: new Date(new Date(1).setHours(new Date(1).getHours() + 1)),
        })


        question = Question.create({
            questionId: "1234",
            description: "yes",
            picture: "http://yes"
        });
    });

    afterEach(async () => {
        await PollModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should get/poll/all", async () => {
        await pollRepository.create(poll);

        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .get("/poll/all")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody).toHaveLength(1);
            })
            .expect(200);
    });

    it("Should post poll/create", async () => {
        await Promise.all(questionMongoFixtures.map(elem => questionRepository.create(elem)));

        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .post("/poll/create")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody).resolves
            })
            .expect(201);
    });

    it("Should get/poll/recent", async () => {
        await pollRepository.create(poll);
        await pollRepository.create(poll2);

        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com"
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .get("/poll/recent")
            .set("access_key", accessKey)
            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.props.pollId).toEqual("5678");
            })
            .expect(200);
    });
});

