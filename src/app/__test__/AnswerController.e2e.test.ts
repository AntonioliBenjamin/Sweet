import 'reflect-metadata';
import "dotenv/config";
import {sign} from "jsonwebtoken";
import supertest from "supertest";
import {Answer} from "../../core/Entities/Answer";
import {AnswerRepository} from "../../core/repositories/AnswerRepository";
import {Gender, User} from "../../core/Entities/User";
import {UserRepository} from "../../core/repositories/UserRepository";
import {UserModel} from "../../adapters/repositories/mongoDb/models/user";
import {QuestionRepository} from "../../core/repositories/QuestionRepository";
import {Question} from "../../core/Entities/Question";
import {connectDB, dropCollections, dropDB} from "../../adapters/__test__/setupTestDb";
import {createExpressServer, useExpressServer} from "routing-controllers";
import {AnswerController} from '../controllers/AnswerController'
import {PovKernel} from "../config/PovKernel";
import {identifiers} from "../../core/identifiers/identifiers";
import {useContainer} from "routing-controllers";

const app = createExpressServer({
    defaults: {
        nullResultCode: 404,
        undefinedResultCode: 204,
        paramOptions: {
            required: false,
        },
    },
});

describe("E2E - AnswerController", () => {
    let accessKey;
    let answerRepository: AnswerRepository;
    let userRepository: UserRepository;
    let answer: Answer;
    let answer2: Answer;
    let questionRepository: QuestionRepository;
    let question: Question;

    beforeAll(async () => {

        await connectDB();

        const container = new PovKernel()

        container.init()

        useContainer(container)

        useExpressServer(app, {
            controllers: [AnswerController]
        })

        questionRepository = container.get(identifiers.QuestionRepository);
        userRepository = container.get(identifiers.UserRepository);
        answerRepository = container.get(identifiers.AnswerRepository);

        question = Question.create({
            questionId: "9999",
            description: "yes",
            picture: "http://yes",
        });

        answer = new Answer({
            answerId: "1234",
            markAsRead: false,
            pollId: "1234",
            question: {
                questionId: "9999",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "4321",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName: "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            from: {
                userId: "9999",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName: "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "9999",
            createdAt: new Date(),
        });

        answer2 = new Answer({
            answerId: "4321",
            pollId: "9999",
            markAsRead: false,
            question: {
                questionId: "1111",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "4321",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName: "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            from: {
                userId: "8888",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName: "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "8888",
            createdAt: new Date(),
        });

        const user2 = new User({
            email: "user2@example.com",
            id: "7",
            password: "password",
            userName: "user Name",
            age: 15,
            firstName: "michou",
            gender: Gender.BOY,
            lastName: "papito",
            schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
            section: "cp",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await userRepository.create(user2);
    });

    beforeEach(async () => {
        await answerRepository.create(answer);
        await answerRepository.create(answer2);
    });

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
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
            schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
            section: "cp",
            createdAt: new Date(),
            updatedAt: null
        });

        await userRepository.create(user);

        accessKey = sign(
            {
                id: "123456",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .post("/answer")
            .set("access_key", accessKey)
            .send({
                userId: user.props.id,
                friendId: null,
                pollId: answer.props.pollId,
                questionId: "9999"
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
            .get("/answer/all/0f87dd7e1c1d7fef5269f007c7b112a22f610cf7")
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
                id: "4321",
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
            .delete(`/answer/${answer.props.answerId}`)
            .set("access_key", accessKey)
            .expect(200);
    });

    it("should patch/answer", async () => {
        accessKey = sign(
            {
                id: "9999",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
            },
            "maytheforcebewithyou"
        );

        await supertest(app)
            .patch(`/answer/${answer.props.answerId}`)
            .set("access_key", accessKey)
            .expect(200);
    });
});
