import mongoose from "mongoose";
import { v4 } from "uuid";
import { UserModel } from "./../repositories/mongoDb/models/user";
import { Gender, User } from "./../../core/Entities/User";
import { MongoDbUserRepository } from "../repositories/mongoDb/repositories/MongoDbUserRepository";

describe("Integration - MongoDbUserRepository", () => {
  let mongoDbUserRepository: MongoDbUserRepository;
  let user: User;
  let result: User;

  beforeAll(async () => {
    const databaseId = v4();
    mongoose.connect(`mongodb://127.0.0.1:27017/${databaseId}`, (err) => {
      if (err) {
        throw err;
      }
      console.info("Connected to mongodb");
    });
    mongoDbUserRepository = new MongoDbUserRepository();
    user = User.create({
      email: "user@example.com",
      id: "12345",
      password: "password",
      userName: "user Name",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
    });
  });

    beforeEach(async () => {
      result = await mongoDbUserRepository.create(user);
    });

    afterEach(async () => {
      await UserModel.collection.drop();
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
      await mongoDbUserRepository.create(user2)
      const result = await mongoDbUserRepository.getAllUsersBySchool("456")
      expect(result).toHaveLength(2)
    })
  });