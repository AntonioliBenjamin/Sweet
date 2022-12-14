import { GetAllUsersBySchool } from "./../../usecases/user/GetAllUsersBySchool";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { User, Gender } from "./../../Entities/User";

const db = new Map<string, User>();

describe("Unit - GetAllUsersBySchool", () => {
  it("should Get All Users By School", async () => {

    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const getAllUsersBySchool = new GetAllUsersBySchool(inMemoryUserRepository);

    const user1 = User.create({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "012345",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
      id: "9999",
    });
    const user2 = User.create({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "012345",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
      id: "8888",
    });

    db.set(user1.props.id, user1);
    db.set(user2.props.id, user2);

    const result = await getAllUsersBySchool.execute("012345");
    expect(result).toHaveLength(2);
  });
});
