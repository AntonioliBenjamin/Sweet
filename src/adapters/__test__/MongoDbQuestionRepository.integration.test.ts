import mongoose from "mongoose";
import {v4} from "uuid";
import {MongoDbQuestionRepository} from "../repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {Question} from "../../core/Entities/Question";
import {QuestionModel} from "../repositories/mongoDb/models/question";
import {questionMongoFixtures} from "../../core/fixtures/questionMongoFixtures";
import {questionFixtures} from "../../core/fixtures/questionFixtures";

describe('Integration - MongoDbQuestionRepository', () => {
    let mongoDbQuestionRepository: MongoDbQuestionRepository;
    let question: Question;
    let question2: Question;
    let result: Question;

    beforeAll(async () => {
        const databaseId = v4();
        mongoose.set('strictQuery', false);
        mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
            if (err) {
                throw err;
            }
            console.info("Connected to mongodb");
        });
        mongoDbQuestionRepository = new MongoDbQuestionRepository();
        question = Question.create({
            questionId: "1234",
            description: "yes",
            picture: "http"
        });

        question2 = Question.create({
            questionId: "5678",
            description: "no",
            picture: "http2"
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
        const array = await mongoDbQuestionRepository.getAllQuestions();
        expect(array).toHaveLength(2);
    });

    it("Should select random questions", async () => {
        const questions =  await Promise.all( questionMongoFixtures.map( elem =>  mongoDbQuestionRepository.create(elem)));
        const result = await mongoDbQuestionRepository.selectRandomQuestions(12);
        expect(result).toHaveLength(12);
    });


});

