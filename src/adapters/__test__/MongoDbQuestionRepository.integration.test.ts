import { MongoDbQuestionRepository } from "../repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { Question } from "../../core/Entities/Question";
import { questionMongoFixtures } from "../../core/fixtures/questionMongoFixtures";
import { QuestionErrors } from "../../core/errors/QuestionErrors";
import {connectDB, dropCollections, dropDB} from "./setupTestDb";
import {myContainer} from "../container/inversify.config";
import {identifiers} from "../../core/identifiers/identifiers";

describe("Integration - MongoDbQuestionRepository", () => {
  let mongoDbQuestionRepository: MongoDbQuestionRepository;
  let question: Question;
  let question2: Question;
  let result: Question;

  beforeAll(async () => {
    mongoDbQuestionRepository = myContainer.get(identifiers.QuestionRepository)

    await connectDB();

    question = Question.create({
      questionId: "1234",
      description: "yes",
      picture: "http",
    });

    question2 = Question.create({
      questionId: "5678",
      description: "no",
      picture: "http2",
    });
  });

  beforeEach(async () => {
    result = await mongoDbQuestionRepository.create(question);
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it("Should save a question", () => {
    expect(result.props.picture).toEqual("http");
  });

  it("Should get all questions", async () => {
    await mongoDbQuestionRepository.create(question2);

    const array = await mongoDbQuestionRepository.getAll();
    expect(array).toHaveLength(2);
  });

  it("Should select random questions", async () => {
    await Promise.all(questionMongoFixtures.map((elem) =>mongoDbQuestionRepository.create(elem)));
    const result = await mongoDbQuestionRepository.selectRandom(12);
    expect(result).toHaveLength(12);
  });

  it("should throw if question not found", async () => {
    const result = () => mongoDbQuestionRepository.getById("false questionID")
    await expect(result).rejects.toThrow(QuestionErrors.NotFound)
  })

  it("should delete question", async () => {
    await mongoDbQuestionRepository.delete(question.props.questionId)
    expect(mongoDbQuestionRepository.getById(question.props.questionId)).rejects.toThrow(QuestionErrors.NotFound)
  })
});
