import 'reflect-metadata';
import {Question} from "../../Entities/Question";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";
import {GetAllQuestions} from "../../usecases/question/GetAllQuestions";


const db = new Map<string, Question>();

describe('Unit - GetAllQuestions', () => {
    let getAllQuestions: GetAllQuestions;
    let question1: Question;
    let question2 : Question;


    beforeAll(() => {
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(db);
        getAllQuestions = new GetAllQuestions(inMemoryQuestionRepository);

        question1 = new Question({
            questionId: "1234",
            description: "yes",
            picture: "http://from"
        })
        question2 = new Question({
            questionId: "5678",
            description: "n0",
            picture: "http://to"
        })

        db.set("1234", question1);
        db.set("5678", question2);
    })

    it('should get all questions', async () => {
        const result = await getAllQuestions.execute();
        expect(result).toHaveLength(2);
    });
});
