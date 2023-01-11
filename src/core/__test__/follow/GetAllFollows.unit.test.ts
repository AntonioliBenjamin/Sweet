import 'reflect-metadata';
import { Followed } from "../../Entities/Followed";
import { Gender, User } from "../../Entities/User";
import { GetMyFollows } from "../../usecases/follow/GetMyFollows";

import { InMemoryFollowRepository } from "../adapters/repositories/InMemoryFollowRepository";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
const db = new Map<string, Followed>();
const userDb = new Map<string, User>();

describe("Unit - getAllFollowers", () => {
  it("should get all follows", async () => {
    const inMemoryFriendShipRepository = new InMemoryFollowRepository(db);
    const inMemoryUserRepository = new InMemoryUserRepository(userDb);
    const getMyFollows = new GetMyFollows(
      inMemoryFriendShipRepository, inMemoryUserRepository
    );

    const followed = Followed.create({
      id: "156489sdfsdf8486",
      userId: "cedric",
      addedBy: "benjamin",
    });

    const friendship2 = Followed.create({
      id: "6546545sdfsdf6465465",
      userId: "benjamin",
      addedBy: "cedric",
    });

    const friendship3 = Followed.create({
      id: "65489646816543545dfsdf",
      userId: "cedric",
      addedBy: "chalom",
    });

    const cedric = new User({
      email: "user@example.com",
      id: "cedric",
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

    const chalom = new User({
      email: "user@example.com",
      id: "chalom",
      password: "password",
      userName: "chalom",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
    });

    const benjamin = new User({
      email: "user@example.com",
      id: "benjamin",
      password: "password",
      userName: "benjamin",
      age: 15,
      firstName: "mich",
      gender: Gender.BOY,
      lastName: "polllich",
      schoolId: "456",
      section: "cp",
      createdAt: new Date(),
      updatedAt: null,
    });

    userDb.set(cedric.props.id, cedric);
    userDb.set(chalom.props.id, chalom);
    userDb.set(benjamin.props.id, benjamin);

    db.set(followed.props.id, followed);
    db.set(friendship2.props.id, friendship2);
    db.set(friendship3.props.id, friendship3);

    const result = await getMyFollows.execute("cedric");
    expect(result).toHaveLength(3);
  });
});
