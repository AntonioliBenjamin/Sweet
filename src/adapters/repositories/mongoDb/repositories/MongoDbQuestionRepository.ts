import {QuestionRepository} from "../../../../core/repositories/QuestionRepository";
import {Question} from "../../../../core/Entities/Question";
import {MongoDbQuestionMapper} from "../mappers/MongoDbQuestionMapper";
import {QuestionModel} from "../models/question";;

const mongoDbQuestionMapper = new MongoDbQuestionMapper();

export class MongoDbQuestionRepository implements QuestionRepository {

    async create(question: Question): Promise<Question> {
        const toQuestionModel = mongoDbQuestionMapper.fromDomain(question)
        const questionModel = new QuestionModel(toQuestionModel);
        await questionModel.save()
        return question;
    }

    async getAllQuestions(): Promise<Question[]> {
        const questions = await QuestionModel.find();
        return questions.map(elm => mongoDbQuestionMapper.toDomain(elm))
    }
}
