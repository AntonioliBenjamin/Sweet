import { Gender } from "./../../Entities/User";
import { DeleteUser } from "../../Usecases/user/DeleteUser";
import { User } from "../../Entities/User";
import { Answer } from "../../Entities/Answer";
import { Followed } from "../../Entities/Followed";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { userDb, answerDb, followDb } from "../adapters/container/inversify.config";


describe("Unit - deleteUser", () => {

  const deleteUser: DeleteUser =  testContainer.get(identifiers.DeleteUser)

  it("should delete user", async () => {
    const followed = new Followed({
      id: "156489sdfsdf8486",
      userId: "12345",
      addedBy: "5555",
    });

    const answer = new Answer({
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
        userId: "12345",
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

    const user = User.create({
      userName: "JOJO",
      email: "jojo@gmail.com",
      password: "1234",
      age: 13,
      firstName: "gdfgdfg",
      gender: Gender.BOY,
      lastName: "dfgdrfg",
      id: "12345",
      schoolId: "15854",
      section: "dfgdfg",
    });

    userDb.set(user.props.id, user);
    answerDb.set(answer.props.answerId, answer);
    followDb.set(followed.props.id, followed);

    await deleteUser.execute({
      userId: "12345",
    });
    
    expect(userDb.get("12345")).toBeFalsy();
    expect(answerDb.get("12345")).toBeFalsy();
    expect(followDb.get("12345")).toBeFalsy();
  });
});
