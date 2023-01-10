import { User, Gender } from "../../Entities/User";
import { testContainer, userDb } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { GetAllMyPotentialFriends } from "../../usecases/user/GetAllMyPotentialFriends";


describe("Unit - GetAllMyPotentialFriends", () => {
  it("should Get All Users By School", async () => {

    const getAllMyPotentialFriends: GetAllMyPotentialFriends = testContainer.get(identifiers.GetAllMyPotentialFriends)

    const user1 = User.create({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "012345",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "12345",
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

    userDb.set(user1.props.id, user1);
    userDb.set(user2.props.id, user2);

    const result = await getAllMyPotentialFriends.execute("012345");
    expect(result).toHaveLength(2);
  });
});
