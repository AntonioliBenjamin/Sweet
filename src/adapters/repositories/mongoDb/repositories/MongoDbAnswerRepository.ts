import {Answer} from "../../../../core/Entities/Answer";
import {AnswerRepository} from "../../../../core/repositories/AnswerRepository";
import {MongoDbAnswerMapper} from "../mappers/MongoDbAnswerMapper";
import {AnswerModel} from "../models/answer";
import {AnswerErrors} from "../../../../core/errors/AnswerErrors";

const answerMapper = new MongoDbAnswerMapper();

export class MongoDbAnswerRepository implements AnswerRepository {
    async create(answer: Answer): Promise<Answer> {
        const toAnswerDomain = answerMapper.fromDomain(answer);
        const answerModel = new AnswerModel(toAnswerDomain);
        await answerModel.save();
        return answer;
    }

    async getAllBySchoolId(schoolId: string, userId: string): Promise<Answer[]> {
        const answers = await AnswerModel.find({
            "response.schoolId": schoolId,
            "response.userId": {
                $ne: userId,
            },
            response: {
                $ne: null
            },
            "userId": {
                $ne: null
            }
        });
        return answers.map((elm) => answerMapper.toDomain(elm));
    }

    async delete(answerId: string): Promise<void> {
        await AnswerModel.deleteOne({answerId: answerId});
        return;
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        await AnswerModel.deleteMany({answer: userId});
        return;
    }

    async getById(answerId: string): Promise<Answer> {
        const answer = await AnswerModel.findOne({answerId: answerId});
        if (!answer) {
            throw new AnswerErrors.NotFound();
        }
        return answerMapper.toDomain(answer);
    }

    async markAsRead(answer: Answer): Promise<Answer> {
        const toAnswerModel = answerMapper.fromDomain(answer);
        await AnswerModel.findOneAndUpdate(
            { answerId: toAnswerModel.answerId },
            {
                $set: {
                    markAsRead: toAnswerModel.markAsRead,
                },
            },
            {new: true}
        );
        return answer;
    }

    async getLastQuestionAnswered(pollId: string, userId: string): Promise<Answer> {
        const answersModel = await AnswerModel.find({pollId: pollId, userId: userId}).sort({_id: -1});
        if (answersModel[0] == null) {
            return null;
        }

        return answerMapper.toDomain(answersModel[0])
    }

    async getAllByUserId(userId: string): Promise<Answer[]> {
        const results = await AnswerModel.find({
            "response.userId": userId,
        })
        return results.map(elm => answerMapper.toDomain(elm))
    }
}
