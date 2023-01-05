import "dotenv/config";
import supertest from "supertest";
import express from "express";
import {questionRouter} from "../routes/question";
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {Question} from "../../core/Entities/Question";
import {sign} from "jsonwebtoken";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";

const app = express();

describe("E2E - Question Router", () => {
    let accessKey;
    let questionRepository: QuestionRepository;
    let question: Question;

    beforeAll(async () => {
        app.use(express.json());
        app.use("/question", questionRouter);

        await connectDB();

        questionRepository = new MongoDbQuestionRepository();

        question = Question.create({
            questionId: "1234",
            description: "yes",
            picture: "http://yes",
        });
    });

    beforeEach(async () => {
        await questionRepository.create(question);
    })

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
    });

    it("Should post /question", async () => {
        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com",
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .post("/question")
            .set("access_key", accessKey)
            .send({
                description: "yes",
                picture: "http://yes",
            })

            .expect((response) => {
                const responseBody = response.body;
                expect(responseBody.description).toEqual("yes");
                expect(responseBody.questionId).toBeTruthy();
            })
            .expect(201);
    });

    it("Should get/question/all", async () => {
        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com",
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

    it("Should delete /question", async () => {
        accessKey = sign(
            {
                id: "1234",
                schoolId: "5678",
                email: "blabla@gmail.com",
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .delete(`/question/${question.props.questionId}`)
            .set("access_key", accessKey)
            .expect(200);
    });
});
