import { Answer } from "../../Entities/Answer"
import { Gender } from "../../Entities/User"
import { AnswerToQuestion } from "../../usecases/answer/AnswerToQuestion"
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { InMemoryAnswerRepository } from "../adapters/repositories/InMemoryAnswerRepository";

const db = new Map<string, Answer>();
describe("Unit - AnswerToQuestion", () => {

    it("should create an Answer", async () => {
        const idGateway = new UuidGateway()
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db)
        const answerToQuestion = new AnswerToQuestion(inMemoryAnswerRepository, idGateway)
        const result = await answerToQuestion.execute({
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
            answer: "7777",
        })

        expect(result.props.answerId).toBeTruthy()
        expect(result.props.question.questionId).toEqual("9999")
    })
})