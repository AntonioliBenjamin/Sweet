import mongoose from "mongoose";
import { v4 } from "uuid";
import { UserModel } from "./../repositories/mongoDb/models/user";
import { Gender, User } from "./../../core/Entities/User";
import { MongoDbUserRepository } from "../repositories/mongoDb/repositories/MongoDbUserRepository";
import { Answer } from "../../core/Entities/Answer";
import { Followed } from "../../core/Entities/Followed";
import { AnswerModel } from "../repositories/mongoDb/models/answer";
import { FollowModel } from "../repositories/mongoDb/models/follow";
import { MongoDbAnswerRepository } from "../repositories/mongoDb/repositories/MongoDbAnswerRepository";
import { MongoDbFollowRepository } from "../repositories/mongoDb/repositories/MongoDbFollowRepository";

describe("Integration - MongoDbUserRepository", () => {
  let mongoDbUserRepository: MongoDbUserRepository;
  let mongoDbFollowRepository: MongoDbFollowRepository;
  let mongoDbAnswerRepository: MongoDbAnswerRepository;
  let user: User;
  let result: User;
  let answer: Answer;
  let follow: Followed;

  beforeAll(async () => {
    const databaseId = v4();
    mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
      if (err) {
        throw err;
      }
      console.info("Connected to mongodb");
    });
    mongoDbUserRepository = new MongoDbUserRepository();
    mongoDbAnswerRepository = new MongoDbAnswerRepository();
    mongoDbFollowRepository = new MongoDbFollowRepository();

    user = new User({
      email: "user@example.com",
      id: "12345",
      password: "password",
      userName: "user name",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
    });

    answer = new Answer({
      answerId: "1234",
      question: {
        questionId: "9999",
        description: "this is a desc",
        picture: "http://pic",
      },
      response: {
        userId: "8888",
        firstName: "name",
        lastName: "lastname",
        userName: "username",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
        section: "1er L",
        gender: Gender.GIRL,
      },
      answer: "12345",
      createdAt: new Date(),
    });

    follow = new Followed({
      id: "156456454564",
      recipientId: "0000",
      senderId: "12345",
    });
  });

  beforeEach(async () => {
    result = await mongoDbUserRepository.create(user);
    await mongoDbAnswerRepository.create(answer);
    await mongoDbFollowRepository.create(follow);
  });

  afterEach(async () => {
    await UserModel.collection.drop();
    await AnswerModel.collection.drop();
    await FollowModel.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Should save a user", () => {
    expect(result.props.userName).toEqual("user name");
  });

  it("Should get a user by email", async () => {
    const result = await mongoDbUserRepository.getByEmail("user@example.com");
    expect(result.props.userName).toEqual("user name");
    expect(result.props.id).toEqual("12345");
  });

  it("should be falsy if user email does not exist", async () => {
    const result = await mongoDbUserRepository.getByEmail(
      "fakeEmail@example.com"
    );
    expect(result).toBeFalsy();
  });

  it("should get a user by id", async () => {
    const result = await mongoDbUserRepository.getById("12345");
    expect(result.props.userName).toEqual("user name");
  });

  it("should throw if userId does not exist", async () => {
    const result = () => mongoDbUserRepository.getById("false ID");
    await expect(() => result()).rejects.toThrow();
  });

  it("should throw if user does not exist", async () => {
    const result = () => mongoDbUserRepository.getById("false ID");
    await expect(() => result()).rejects.toThrow();
  });

  it("should update a user", async () => {
    user.update({
      userName: "newusername",
      age: 13,
      firstName: "gdfgdfg",
      lastName: "dfgdrfg",
      section: "dfgdfg",
    });
    const result = await mongoDbUserRepository.update(user);
    expect(result.props.id).toEqual("12345");
    expect(result.props.userName).toEqual("newusername");
  });

  it("should delete a user", async () => {
    await mongoDbUserRepository.delete(user.props.id);
    const result = await mongoDbUserRepository.getByEmail(
      "fakeEmail@example.com"
    );
    expect(result).toBeFalsy();
    await expect(
      AnswerModel.findOne({ answerId: user.props.id })
    ).resolves.toEqual(null);
    await expect(FollowModel.findOne({ id: user.props.id })).resolves.toEqual(
      null
    );
  });

  it("should get all users by school", async () => {
    const user2 = User.create({
      email: "user@example.com",
      id: "9999",
      password: "password",
      userName: "user Name",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
    });
    await mongoDbUserRepository.create(user2);
    const result = await mongoDbUserRepository.getAllUsersBySchool("456");
    expect(result).toHaveLength(2);
  });
});
