import {Answer} from "../../Entities/Answer";
import {Poll} from "../../Entities/Poll";
import {Question} from "../../Entities/Question";
import {Gender, User} from "../../Entities/User";
import {AnswerToQuestion} from "../../usecases/answer/AnswerToQuestion";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {InMemoryAnswerRepository} from "../adapters/repositories/InMemoryAnswerRepository";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";
import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {School} from "../../Entities/School";
import {InMemorySchoolRepository} from "../adapters/repositories/InMemorySchoolRepository";
import { FakeFirebaseGateway } from "../adapters/gateways/FakeFirebaseGateway";

const db = new Map<string, Answer>();
const questionDb = new Map<string, Question>();
const userDb = new Map<string, User>();
const schoolDb = new Map<string, School>();

describe("Unit - AnswerToQuestion", () => {
    let answerToQuestion: AnswerToQuestion;
    let poll: Poll
    let question: Question;
    let user: User;
    let user2: User;
    let school: School

    beforeAll(() => {
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(questionDb);
        const idGateway = new UuidGateway();
        const inMemoryAnswerRepository = new InMemoryAnswerRepository(db);
        const inMemoryUserRepository = new InMemoryUserRepository(userDb);
        const inMemorySchoolRepository = new InMemorySchoolRepository(schoolDb)
        const fakeFirebase = new FakeFirebaseGateway()
        answerToQuestion = new AnswerToQuestion(
            inMemoryAnswerRepository,
            inMemoryUserRepository,
            inMemoryQuestionRepository,
            inMemorySchoolRepository,
            idGateway, 
            fakeFirebase
        );

        question = Question.create({
            questionId: "9999",
            description: "yes",
            picture: "http://yes"
        });
        questionDb.set(question.props.questionId, question);

        poll = new Poll({
            createdAt: new Date(),
            expirationDate: null,
            pollId: "1234",
        })

        school = new School({
            id: "3333",
            name: "schoolName",
            city: "schoolCity",
            district: "schoolDistrict",
        })

        schoolDb.set(school.props.id, school);

        user = new User({
            email: "user@example.com",
            id: "123456",
            password: "password",
            userName: "user Name",
            age: 15,
            firstName: "michou",
            gender: Gender.BOY,
            lastName: "papito",
            schoolId: "3333",
            section: "cp",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: null
        });
        userDb.set(user.props.id, user);

        user2 = new User({
            email: "user@example.com",
            id: "123456",
            password: "password",
            userName: "user Name",
            age: 15,
            firstName: "michou",
            gender: Gender.BOY,
            lastName: "papito",
            schoolId: "3333",
            section: "cp",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: null
        });
        userDb.set(user2.props.id, user2);
    })

    it("should create an Answer", async () => {
        const result = await answerToQuestion.execute({
            pollId: poll.props.pollId,
            questionId: question.props.questionId,
            friendId: user.props.id,
            userId: user2.props.id
        });

        expect(result.props.answerId).toBeTruthy();
        expect(result.props.question.questionId).toEqual("9999");
    })

    it("should add an empty answer", async () => {
        const result = await answerToQuestion.execute({
            pollId: "12",
            questionId: question.props.questionId,
            userId: user.props.id,
            friendId: null
        })
        expect(result.props.response).toBeFalsy()
    })
})