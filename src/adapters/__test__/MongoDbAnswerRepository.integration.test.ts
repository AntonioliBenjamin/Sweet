import {Answer} from "../../core/Entities/Answer";
import {Gender} from "../../core/Entities/User";
import {AnswerModel} from "../repositories/mongoDb/models/answer";
import {MongoDbAnswerRepository} from "../repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {AnswerErrors} from "../../core/errors/AnswerErrors";
import {connectDB, dropCollections, dropDB} from "./setupTestDb";

describe("Integration - MongoDbAnswerRepository", () => {
    let mongoDbAnswerRepository: MongoDbAnswerRepository;
    let answer: Answer;
    let answer2: Answer;
    let answer3: Answer;
    let answer4: Answer;

    beforeAll(async () => {
        await connectDB();

        mongoDbAnswerRepository = new MongoDbAnswerRepository();

        answer = new Answer({
            answerId: "1234",
            markAsRead : true,
            pollId: "1234",
            question: {
                questionId: "1111",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "1111",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "9999",
            createdAt: new Date(100),
        });

        answer2 = new Answer({
            answerId: "4321",
            markAsRead : false,
            pollId: "1234",
            question: {
                questionId: "2222",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "3333",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "9999",
            createdAt: new Date(150),
        });

        answer3 = new Answer({
            answerId: "985498",
            markAsRead : false,
            pollId: "1234",
            question: {
                questionId: "3333",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "2222",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName3",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "7777",
            createdAt: new Date(),
        });

        answer4 = new Answer({
            answerId: "684654",
            markAsRead : false,
            pollId: "8888",
            question: {
                questionId: "4444",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "1111",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName4",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "6666",
            createdAt: new Date(),
        });
    });

    beforeEach(async () => {
        await mongoDbAnswerRepository.create(answer);
        await mongoDbAnswerRepository.create(answer2);
        await mongoDbAnswerRepository.create(answer3);
        await mongoDbAnswerRepository.create(answer4);
    });

    afterEach(async () => {
        await dropCollections();
    });

    afterAll(async () => {
        await dropDB();
    });

    it("should save answer", async () => {
        const result = await mongoDbAnswerRepository.create(new Answer({
            answerId: "7894564123",
            markAsRead : false,
            pollId: "1111",
            question: {
                questionId: "1111",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "9999",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "8888",
            createdAt: new Date(),
        }));

        expect(result.props.answerId).toEqual("7894564123");
    });

    it("should get all answers", async () => {
        const result = await mongoDbAnswerRepository.getAllBySchoolId(answer.props.response.schoolId, answer.props.response.userId);
        expect(result).toHaveLength(2);
    })

    it("should delete answer", async () => {
        await mongoDbAnswerRepository.delete(answer.props.answerId);
        const result = await AnswerModel.findOne({ answerId: answer.props.answerId});
        expect(result).toBeFalsy();
    })

    it("should get answer by id", async () => {
        const result = await mongoDbAnswerRepository.getById(answer.props.answerId);
        expect(result.props.markAsRead).toEqual(true);
    })

    it("should throw an error because answer not found", async () => {
        const result = mongoDbAnswerRepository.getById("wrong id");
        await expect(result).rejects.toThrow(AnswerErrors.NotFound);
    })

    it("should mark answer mark read", async () => {
        answer.markAsRead();

        const result = await mongoDbAnswerRepository.markAsRead(answer);

        expect(result.props.markAsRead).toEqual(true);
    });

    it("should get the last question answered", async () => {
        const result = await mongoDbAnswerRepository.getLastQuestionAnswered(answer.props.pollId, answer.props.userId)
        expect(result.props.question.questionId).toEqual("2222")
    })
});
