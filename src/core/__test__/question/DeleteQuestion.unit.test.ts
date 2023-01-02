import {Question} from "../../Entities/Question";
import {InMemoryQuestionRepository} from "../adapters/repositories/InMemoryQuestionRepository";
import {DeleteQuestion} from "../../usecases/question/DeleteQuestion";

const db = new Map<string, Question>();

describe("Unit - DeleteQuestion", () => {
    it("should create question", async () => {
        const inMemoryQuestionRepository = new InMemoryQuestionRepository(db);
        const deleteQuestion = new DeleteQuestion(inMemoryQuestionRepository);

        const question = new Question({
            description: "cool",
            picture: "http",
            questionId: "1234"
        })

        db.set(question.props.questionId, question)

        await deleteQuestion.execute("1234");
        expect(db.get("1234")).toBeFalsy();
    });
});
