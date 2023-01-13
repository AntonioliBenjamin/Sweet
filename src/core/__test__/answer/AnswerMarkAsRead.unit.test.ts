import {Answer} from "../../Entities/Answer";
import {Gender} from "../../Entities/User";
import {InMemoryAnswerRepository} from "../adapters/repositories/InMemoryAnswerRepository";
import {AnswerMarkAsRead} from "../../usecases/answer/AnswerMarkAsRead";
import {AnswerErrors} from "../../errors/AnswerErrors";

const db = new Map<string, Answer>();

describe("Unit - AnswerMarkAsRead", () => {
let answerMarkAsRead : AnswerMarkAsRead

    beforeAll(async () =>{
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db);
        answerMarkAsRead = new AnswerMarkAsRead(inMemoryAnswerRepository);
    })

    it("should mark answer as read", async () => {
        const answer = new Answer({
            answerId: "1234",
            markAsRead : false,
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
                age: 12,
                userName: "username",
                schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
                schoolName : "schoolName",
                section: "1er L",
                gender: Gender.GIRL,
            },
            from: {
                userId: "8888",
                firstName: "name",
                age: 12,
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

        const result : Answer = await answerMarkAsRead.execute("1234");

        expect(result.props.markAsRead).toEqual(true);
    })

it ("should throw if wrong id", ()=> {
    const result = ()=> answerMarkAsRead.execute("wrong id");

    expect(()=> result()).rejects.toThrow(AnswerErrors.NotFound)
})
})