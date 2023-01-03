import {Answer} from "../../Entities/Answer";
import {Gender} from "../../Entities/User";
import {GetFriendAnswers} from "../../usecases/answer/GetFriendAnswers";
import {InMemoryAnswerRepository} from "../adapters/repositories/InMemoryAnswerRepository";

const db = new Map<string, Answer>();

describe("Unit - AnswerToQuestion", () => {
    it("should get follow Answers", async () => {
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db);
        const getFriendAnswers = new GetFriendAnswers(inMemoryAnswerRepository);

        const answer = new Answer({
            answerId: "1234",
            markAsRead: true,
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
                section: "1er L",
                gender: Gender.GIRL,
            },
            answer: "8888",
            createdAt: new Date()
        })
        db.set(answer.props.answerId, answer);

        const answer2 = new Answer({
            answerId: "4321",
            markAsRead: false,
            question: {
                questionId: "1111",
                description: "this is a desc",
                picture: "http://pic",
            },
            response: {
                userId: "0000",
                firstName: "name",
                lastName: "lastname",
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                section: "1er L",
                gender: Gender.GIRL,
            },
            answer: "8888",
            createdAt: new Date()
        })
        db.set(answer2.props.answerId, answer2);

        const result = await getFriendAnswers.execute("8888");

        expect(result).toHaveLength(2);
    })
})