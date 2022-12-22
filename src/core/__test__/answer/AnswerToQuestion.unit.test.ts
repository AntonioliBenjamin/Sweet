import { Answer } from "../../Entities/Answer"
import { Question } from "../../Entities/Question";
import { Gender, User } from "../../Entities/User"
import { AnswerToQuestion } from "../../usecases/answer/AnswerToQuestion"
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { InMemoryAnswerRepository } from "../adapters/repositories/InMemoryAnswerRepository";
import { InMemoryQuestionRepository } from "../adapters/repositories/InMemoryQuestionRepository";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";

const db = new Map<string, Answer>();
const questionDb = new Map<string, Question>();
const userDb = new Map<string, User>();

describe("Unit - AnswerToQuestion", () => {

    it("should create an Answer", async () => {
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(questionDb);
        const idGateway = new UuidGateway()
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db)
        const inMemoryUserRepository = new InMemoryUserRepository(userDb);
        const answerToQuestion = new AnswerToQuestion(inMemoryAnswerRepository, inMemoryUserRepository, inMemoryQuestionRepository, idGateway)

        const question = Question.create({
            questionId: "9999",
            description: "yes",
            picture: "http://yes"
        });
        questionDb.set(question.props.questionId, question)

        const user = new User({
          email: "user@example.com",
          id: "123456",
          password: "password",
          userName: "user Name",
          age: 15,
          firstName: "michou",
          gender: Gender.BOY,
          lastName: "papito",
          schoolId: "456",
          section: "cp",
          createdAt: new Date(),
          updatedAt: null,
          recoveryCode: null
        }); 

        const user2 = new User({
            email: "user@example.com",
            id: "123456",
            password: "password",
            userName: "user Name",
            age: 15,
            firstName: "michou",
            gender: Gender.BOY,
            lastName: "papito",
            schoolId: "456",
            section: "cp",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: null
          }); 
        userDb.set(user.props.id, user);
        userDb.set(user2.props.id, user2);

        
        const result = await answerToQuestion.execute({
            questionId: question.props.questionId,
            answerUserId: user.props.id,
            userId: user2.props.id
        })
        expect(result.props.answerId).toBeTruthy()
        expect(result.props.question.questionId).toEqual("9999")
    })
})