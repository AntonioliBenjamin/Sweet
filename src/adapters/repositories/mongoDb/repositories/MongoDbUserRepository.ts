import { MongoDbUserMapper } from "../mappers/MongoDbUserMapper";
import { UserRepository } from "../../../../core/repositories/UserRepository";
import { User } from "../../../../core/Entities/User";
import { UserModel } from "../models/user";
const mongoDbUserMapper = new MongoDbUserMapper();

export class MongoDbUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const toUserModel = mongoDbUserMapper.fromDomain(user)
    const userModel = new UserModel(toUserModel);
    await userModel.save()
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return null;
    }
    return mongoDbUserMapper.toDomain(user);
  }

  async getById(id: string): Promise<User> {
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      throw new Error("user not found");
    }
    return mongoDbUserMapper.toDomain(user);
  }

  async update(input: User): Promise<User> {
    const toUserModel = mongoDbUserMapper.fromDomain(input)
    await UserModel.findOneAndUpdate(
      { id: toUserModel.id },
      {
        $set: {
          userName: toUserModel.userName,
          updatedAt: toUserModel.updatedAt,
          age: toUserModel.age,
          firstName: toUserModel.firstName,
          lastName: toUserModel.lastName,
          section: toUserModel.section, 
        },
      },
      { new: true }
    );
    return input;
  }

  async delete(userId: string): Promise<void> {
    await UserModel.deleteOne({ id: userId })
    return;
  }
}
