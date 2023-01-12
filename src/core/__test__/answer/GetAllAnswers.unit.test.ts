import 'reflect-metadata';
import {Answer} from "../../Entities/Answer";
import {Gender} from "../../Entities/User";
import {GetAllAnswers} from "../../usecases/answer/GetAllAnswers";
import {InMemoryAnswerRepository} from "../adapters/repositories/InMemoryAnswerRepository";

const db = new Map<string, Answer>();

describe("Unit - GetAllAnswers", () => {
    it("should get follow Answers", async () => {
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db);
        const getAllAnswers = new GetAllAnswers(inMemoryAnswerRepository);

        const answer = new Answer({
            answerId: "1234",
            markAsRead: true,
            pollId: "123",
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
                schoolName: "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            from: {
                userId: "8888",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName: "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "",
            createdAt: new Date()
        })
        db.set(answer.props.answerId, answer);

        const answer2 = new Answer({
            answerId: "4321",
            markAsRead: true,
            pollId: "123",
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
                schoolName: "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "",
            createdAt: new Date()
        })
        db.set(answer2.props.answerId, answer2);

        const result = await getAllAnswers.execute({
            schoolId: answer.props.response.schoolId,
            userId: answer.props.userId
        });

        expect(result).toHaveLength(2);
    })
})