import mongoose from "mongoose";
import {v4} from "uuid";
import {Answer} from "../../core/Entities/Answer";
import {Gender} from "../../core/Entities/User";
import {AnswerModel} from "../repositories/mongoDb/models/answer";
import {MongoDbAnswerRepository} from "../repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {AnswerErrors} from "../../core/errors/AnswerErrors";

describe("Integration - MongoDbAnswerRepository", () => {
    let mongoDbAnswerRepository: MongoDbAnswerRepository;
    let answer: Answer;
    let answer2: Answer;

    beforeAll(async () => {
        const databaseId = v4();
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });

        mongoDbAnswerRepository = new MongoDbAnswerRepository();

        answer = new Answer({
            answerId: "1234",
            markAsRead : true,
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
            markAsRead : true,
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
        await mongoDbAnswerRepository.create(answer);
        await mongoDbAnswerRepository.create(answer2);
    });

    afterEach(async () => {
        await AnswerModel.collection.drop();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should save answer", async () => {
        const result = await mongoDbAnswerRepository.create(new Answer({
            answerId: "7894564123",
            markAsRead : false,
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
        }));

        expect(result.props.answerId).toEqual("7894564123");
    });

    it("should get all answers", async () => {

        const result = await mongoDbAnswerRepository.getAllAnswers();
        expect(result).toHaveLength(2)
    })

    it("should delete answer", async () => {
        await mongoDbAnswerRepository.delete(answer.props.answerId);
        const result = await AnswerModel.findOne({answerId: answer.props.answerId});
        expect(result).toBeFalsy();
    })

    it("should get answer by id", async () => {
        const result = await mongoDbAnswerRepository.getById(answer.props.answerId);
        expect(result.props.markAsRead).toEqual(true);
    })

    it("should throw an error because answer not found", async () => {
        const result = ()=>  mongoDbAnswerRepository.getById("wrong id");
        await expect(()=>result()).rejects.toThrow(AnswerErrors.NotFound);
    })

    it("should mark answer mark read", async () => {
        answer.markAsRead();

        const result = await mongoDbAnswerRepository.markAsRead(answer);

        expect(result.props.markAsRead).toEqual(true);
    });
});
