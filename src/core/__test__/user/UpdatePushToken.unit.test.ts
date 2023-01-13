import 'reflect-metadata';
import { Gender } from "./../../Entities/User";
import { User } from "../../Entities/User";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UpdatePushToken } from "../../usecases/user/UpdatePushToken";

const db = new Map<string, User>();

describe("Unit - UpdateUser", () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let updatPushToken: UpdatePushToken;
  let user: User;

  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUserRepository(db);
    updatPushToken = new UpdatePushToken(inMemoryUserRepository);

    user = new User({
      userName: "JOJO",
      email: "jojo@gmail.com",
      password: "1234",
      age: 13,
      firstName: "gdfgdfg",
      gender: Gender.BOY,
      lastName: "dfgdrfg",
      schoolId: "6789",
      section: "dfgdfg",
      createdAt: null,
      id: "4165465",
      updatedAt: null,
      pushToken: null,
      recoveryCode: null,
    });

    db.set(user.props.id, user)
  });

  it("should update user", async () => {
    const result = await updatPushToken.execute({
        userId: "4165465",
        pushToken: "new push token"
    });
    expect(result.props.pushToken).toEqual("new push token")
  });
});
