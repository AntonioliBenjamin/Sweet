import {Gender, User} from "./../../core/Entities/User";
import {MongoDbUserRepository} from "../repositories/mongoDb/repositories/MongoDbUserRepository";
import {Answer} from "../../core/Entities/Answer";
import {Followed} from "../../core/Entities/Followed";
import {AnswerModel} from "../repositories/mongoDb/models/answer";
import {FollowModel} from "../repositories/mongoDb/models/follow";
import {MongoDbAnswerRepository} from "../repositories/mongoDb/repositories/MongoDbAnswerRepository";
import {MongoDbFollowRepository} from "../repositories/mongoDb/repositories/MongoDbFollowRepository";
import {connectDB, dropCollections, dropDB} from "./setupTestDb";

describe("Integration - MongoDbUserRepository", () => {
  let mongoDbUserRepository: MongoDbUserRepository;
  let mongoDbFollowRepository: MongoDbFollowRepository;
  let mongoDbAnswerRepository: MongoDbAnswerRepository;
  let user: User;
  let user2: User;
  let user3: User;
  let result: User;
  let answer: Answer;
  let follow: Followed;

  beforeAll(async () => {
    await connectDB();

    mongoDbUserRepository = new MongoDbUserRepository();
    mongoDbAnswerRepository = new MongoDbAnswerRepository();
    mongoDbFollowRepository = new MongoDbFollowRepository();

    user = new User({
      email: "user@example.com",
      id: "12345",
      password: "password",
      userName: "mickey",
      age: 15,
      firstName: "mickey",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
      pushToken: null
    });

    user2 = User.create({
      email: "user1@example.com",
      id: "9999",
      password: "password",
      userName: "mickael",
      age: 15,
      firstName: "mickael",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
    });

    user3 = User.create({
      email: "user2@example.com",
      id: "sdfsdf",
      password: "password",
      userName: "mini",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "0000",
      section: "cp",
    });

    answer = new Answer({
      answerId: "1234",
      markAsRead : true,
      pollId:"123",
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
        schoolName : "schoolName",
        section: "1er L",
        gender: Gender.GIRL,
      },
      from: {
        userId: "8888",
        firstName: "name",
        lastName: "lastname",
        userName: "username",
        schoolId: "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7",
        schoolName : "schoolName2",
        section: "1er L",
        gender: Gender.GIRL,
      },
      userId: "12345",
      createdAt: new Date(),
    });

    follow = new Followed({
      id: "156456454564",
      userId: "0000",
      addedBy: "12345",
    });
  });

  beforeEach(async () => {
    result = await mongoDbUserRepository.create(user);
    await mongoDbUserRepository.create(user2);
    await mongoDbUserRepository.create(user3);
    await mongoDbAnswerRepository.create(answer);
    await mongoDbFollowRepository.create(follow);
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it("should get all users by school", async () => {
    const result = await mongoDbUserRepository.getAllUsersBySchool("456");
    expect(result).toHaveLength(2);
  });

  it("Should save a user", () => {
    expect(result.props.userName).toEqual("mickey");
  });

  it("should search all users who contains the keyword in userName", async () => {
    const result = await mongoDbUserRepository.searchFriends("mick")
    expect(result).toHaveLength(2)
  })

  it("should search all users who cotains the keyword in userName in the same school", async () => {
    const result = await mongoDbUserRepository.searchFriends("mi", "456")
    expect(result).toHaveLength(2)
  }) 

  it("Should get a user by email", async () => {
    const result = await mongoDbUserRepository.getByEmail("user@example.com");
    expect(result.props.userName).toEqual("mickey");
    expect(result.props.id).toEqual("12345");
  });

  it("should be falsy if user email does not exist", async () => {
    const result = await mongoDbUserRepository.getByEmail("fakeEmail@example.com");
    expect(result).toBeFalsy();
  });

  it("should get a user by id", async () => {
    const result = await mongoDbUserRepository.getById("12345");
    expect(result.props.userName).toEqual("mickey");
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
      gender : Gender.GIRL,
      firstName: "gdfgdfg",
      lastName: "dfgdrfg",
      section: "dfgdfg",
      schoolId : "3333"
    });

    const result = await mongoDbUserRepository.update(user);

    expect(result.props.id).toEqual("12345");
    expect(result.props.userName).toEqual("newusername");
    expect(result.props.gender).toEqual("girl");
    expect(result.props.schoolId).toEqual("3333");
  });

  it("should delete a user", async () => {
    await mongoDbUserRepository.delete(user.props.id);

    const result = await mongoDbUserRepository.getByEmail("fakeEmail@example.com");

    expect(result).toBeFalsy();
    await expect(AnswerModel.findOne({ friendId: user.props.id })).resolves.toEqual(null);
    await expect(FollowModel.findOne({ id: user.props.id })).resolves.toEqual(null);
  });

  it("should update pushToken", async () => {
    user.updatePushtoken("new push token");
    expect(result.props.pushToken).toEqual("new push token")
  })

  it("should get by userId Array", async () => {
    const result = await mongoDbUserRepository.getByUserIds(["12345", "9999", "sdfsdf"])
    expect(result).toHaveLength(3)
  })

  it("shoul update password", async () => {
    user.props.password = "new password"

    await mongoDbUserRepository.updatePassword(user)
    const result = await mongoDbUserRepository.getById(user.props.id)
    expect(result.props.password).toEqual("new password")
  })

});
