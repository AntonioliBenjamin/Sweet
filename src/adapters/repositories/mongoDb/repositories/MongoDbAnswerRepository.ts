import { Answer } from "../../../../core/Entities/Answer";
import { AnswerRepository } from "../../../../core/repositories/AnswerRepository";
import { MongoDbAnswerMapper } from "../mappers/MongoDbAnswerMapper";
import { AnswerModel } from "../models/answer";
const answerMapper = new MongoDbAnswerMapper()

export class MongoDbAnswerRepository implements AnswerRepository {
    async create(answer: Answer): Promise<Answer> {
        const toAnswerDomain = answerMapper.fromDomain(answer)
        const answerModel = new AnswerModel(toAnswerDomain)
        await answerModel.save()
        return answer
    }

    async getAllAnswers(): Promise<Answer[]> {
        const answers = await AnswerModel.find({})
        if(!answers) {
            return null
        }
        return answers.map(elm => answerMapper.toDomain(elm))
    }
    
}