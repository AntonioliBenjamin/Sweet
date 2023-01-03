import { Answer } from "../../../../core/Entities/Answer";
import { AnswerRepository } from "../../../../core/repositories/AnswerRepository";
import { MongoDbAnswerMapper } from "../mappers/MongoDbAnswerMapper";
import { AnswerModel } from "../models/answer";
import {UserModel} from "../models/user";
import {AnswerErrors} from "../../../../core/errors/AnswerErrors";
const answerMapper = new MongoDbAnswerMapper();

export class MongoDbAnswerRepository implements AnswerRepository {
  async create(answer: Answer): Promise<Answer> {
    const toAnswerDomain = answerMapper.fromDomain(answer);
    const answerModel = new AnswerModel(toAnswerDomain);
    await answerModel.save();
    return answer;
  }

  async getAllAnswers(): Promise<Answer[]> {
    const answers = await AnswerModel.find({});
    if (!answers) {
      return null;
    }
    return answers.map((elm) => answerMapper.toDomain(elm));
  }

  async delete(answerId: string): Promise<void> {
    await AnswerModel.deleteOne({ answerId: answerId });
    return;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await AnswerModel.deleteMany({ answer: userId });
    return;
  }

  async getById(answerId: string): Promise<Answer> {
    const answer = await AnswerModel.findOne({ answerId: answerId });
    if (!answer) {
      throw new AnswerErrors.NotFound();
    }
    return answerMapper.toDomain(answer);
  }

  async markAsRead(answer: Answer): Promise<Answer> {
    const toAnswerModel = answerMapper.fromDomain(answer);
    await AnswerModel.findOneAndUpdate(
        { id: toAnswerModel.answerId },
        {
          $set: {
            markAsRead: toAnswerModel.markAsRead,
          },
        },
        { new: true }
    );
    return answer;
  }
}
