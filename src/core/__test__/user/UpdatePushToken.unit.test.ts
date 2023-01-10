import { Gender } from "./../../Entities/User";
import { User } from "../../Entities/User";
import { userDb } from "../adapters/container/inversify.config";
import { UpdatePushToken } from "../../usecases/user/UpdatePushToken";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";


describe("Unit - UpdatePushToken", () => {
  let updatePushToken: UpdatePushToken;
  let user: User;

  beforeAll(async () => {
    updatePushToken = testContainer.get(identifiers.UpdatePushToken)

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

    userDb.set(user.props.id, user)
  });

  it("should update user", async () => {
    const result = await updatePushToken.execute({
        userId: "4165465",
        pushToken: "new push token"
    });
    expect(result.props.pushToken).toEqual("new push token")
  });
});
