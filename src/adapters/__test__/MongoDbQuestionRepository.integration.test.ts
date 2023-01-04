import mongoose from "mongoose";
import { v4 } from "uuid";
import { MongoDbQuestionRepository } from "../repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { Question } from "../../core/Entities/Question";
import { QuestionModel } from "../repositories/mongoDb/models/question";
import { questionMongoFixtures } from "../../core/fixtures/questionMongoFixtures";
import { QuestionErrors } from "../../core/errors/QuestionErrors";

describe("Integration - MongoDbQuestionRepository", () => {
  let mongoDbQuestionRepository: MongoDbQuestionRepository;
  let question: Question;
  let question2: Question;
  let result: Question;

  beforeAll(async () => {
    mongoDbQuestionRepository = new MongoDbQuestionRepository();

    const databaseId = v4();
    mongoose.set("strictQuery", false);
    mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
      if (err) {
        throw err;
      }
      console.info("Connected to mongodb");
    });

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
    await QuestionModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
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
