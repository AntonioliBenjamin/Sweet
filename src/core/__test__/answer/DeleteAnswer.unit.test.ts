import 'reflect-metadata';
import {Answer} from "../../Entities/Answer";
import {Gender} from "../../Entities/User";
import {DeleteAnswer} from "../../usecases/answer/DeleteAnswer";
import {InMemoryAnswerRepository} from "../adapters/repositories/InMemoryAnswerRepository";

const db = new Map<string, Answer>();

describe("Unit - AnswerToQuestion", () => {
    it("should get follow Answers", async () => {
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db);
        const deleteAnswer = new DeleteAnswer(inMemoryAnswerRepository);

        const answer = new Answer({
            answerId: "1234",
            markAsRead : true,
            pollId:"123",
            question: {
                questionId: "9999",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "0000",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            from: {
                userId: "8888",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "8888",
            createdAt: new Date()
        });
        db.set(answer.props.answerId, answer);

        await deleteAnswer.execute("1234");

        expect(db.get("1234")).toBeFalsy();
    })
})