import { Answer } from "../../Entities/Answer";
import { Gender } from "../../Entities/User";
import { GetLastQuestionAnswered } from "../../usecases/answer/GetLastQuestionAnswered"
import { InMemoryAnswerRepository } from "../adapters/repositories/InMemoryAnswerRepository"

const db = new Map<string, Answer>();

describe("Unit - GetLastQuestionAnswered", () => {

    it("should get the last question answered", async () => {
        
        const answer = new Answer({
            answerId: "1234",
            markAsRead: true,
            pollId: "1234",
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
            userId: "8888",
            createdAt: new Date(10)
        })

        const answer2 = new Answer({
            answerId: "4321",
            markAsRead: false,
            pollId: "1234",
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
                schoolName : "schoolName2",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "8888",
            createdAt: new Date(20)
        })

        const answer3 = new Answer({
            answerId: "4321",
            markAsRead: false,
            pollId: "1234",
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
                schoolName : "schoolName3",
                section: "1er L",
                gender: Gender.GIRL,
            },
            userId: "8888",
            createdAt: new Date()
        })

        db.set(answer.props.answerId, answer)
        db.set(answer2.props.answerId, answer2)
        db.set(answer3.props.answerId, answer3)


        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db)
        const getLastQuestionAnswered = new GetLastQuestionAnswered(inMemoryAnswerRepository)

        const result = await getLastQuestionAnswered.execute({
            pollId: "1234",
            userId: "0000"
        })
        expect(result.props.question.questionId).toEqual("1111")
    })
})