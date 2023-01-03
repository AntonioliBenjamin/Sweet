import { MongoDbUserMapper } from "../mappers/MongoDbUserMapper";
import { UserRepository } from "../../../../core/repositories/UserRepository";
import { User } from "../../../../core/Entities/User";
import { UserModel } from "../models/user";
import {UserErrors} from "../../../../core/errors/UserErrors";

const mongoDbUserMapper = new MongoDbUserMapper();

export class MongoDbUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const toUserModel = mongoDbUserMapper.fromDomain(user);
    const userModel = new UserModel(toUserModel);
    await userModel.save();
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return null;
    }
    return mongoDbUserMapper.toDomain(user);
  }

  async getAllUsersBySchool(schoolId: string): Promise<User[]> {
    const users = await UserModel.find({ schoolId: schoolId });
    return users.map((elm) => mongoDbUserMapper.toDomain(elm));
  }

  async getById(id: string): Promise<User> {
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      throw new UserErrors.NotFound();
    }
    return mongoDbUserMapper.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const toUserModel = mongoDbUserMapper.fromDomain(user);
    await UserModel.findOneAndUpdate(
      { id: toUserModel.id },
      {
        $set: {
          userName: toUserModel.userName,
          updatedAt: toUserModel.updatedAt,
          gender: toUserModel.gender,
          firstName: toUserModel.firstName,
          lastName: toUserModel.lastName,
          section: toUserModel.section,
          schoolId : toUserModel.schoolId,
          recoveryCode: toUserModel.recoveryCode,
        },
      },
      { new: true }
    );
    return user;
  }

  async updatePassword(user: User): Promise<void> {
    const toUserModel = mongoDbUserMapper.fromDomain(user);
    await UserModel.findOneAndUpdate(
      { id: toUserModel.id },
      {
        $set: {
          password: toUserModel.password,
        },
      }
    );
    return;
  }

  async delete(userId: string): Promise<void> {
    await UserModel.deleteOne({ id: userId });
    return;
  }

  async searchFriends(keyword: string, schoolId?: string): Promise<User[]> {
    if (schoolId) {
      const users = await UserModel.find({ schoolId : schoolId, userName: new RegExp(keyword, 'i') })
      return users.map(elm => mongoDbUserMapper.toDomain(elm)) 
    }
   
    const users = await UserModel.find({ userName: new RegExp(keyword, 'i') });
    return users.map(elm => mongoDbUserMapper.toDomain(elm))
  }
}
