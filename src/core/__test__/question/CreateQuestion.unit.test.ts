import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { Question } from "../../Entities/Question";
import { CreateQuestion } from "../../usecases/question/CreateQuestion";
import { InMemoryQuestionRepository } from "../adapters/repositories/InMemoryQuestionRepository";

const db = new Map<string, Question>();

describe("Unit - CreateQuestion", () => {
  it("should create question", async () => {
    const inMemoryQuestionRepository = new InMemoryQuestionRepository(db);
    const uuidGateway = new UuidGateway();
    const createQuestion = new CreateQuestion(
      inMemoryQuestionRepository,
      uuidGateway
    );

    const result = await createQuestion.execute({
      description: "what is the day today",
      picture: "http/picture",
    });

    expect(result.props.questionId).toBeTruthy();
    expect(result.props.description).toEqual("what is the day today");
  });
});
