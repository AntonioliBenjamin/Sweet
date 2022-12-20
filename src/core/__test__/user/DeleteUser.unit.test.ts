import { Gender } from "./../../Entities/User";
import { DeleteUser } from "../../Usecases/user/DeleteUser";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { User } from "../../Entities/User";
import { InMemoryFollowRepository } from "../adapters/repositories/InMemoryFollowRepository";
import { InMemoryAnswerRepository } from "../adapters/repositories/InMemoryAnswerRepository";
import { Answer } from "../../Entities/Answer";
import { Followed } from "../../Entities/Followed";

const db = new Map<string, User>();
const dbAnswer = new Map<string, Answer>();
const dbFollow = new Map<string, Followed>();

describe("Unit - deleteUser", () => {
  const inMemoryUserRepository = new InMemoryUserRepository(db);
  const inMemoryFollowRepository = new InMemoryFollowRepository(dbFollow);
  const inMemoryAnswerRepository = new InMemoryAnswerRepository(dbAnswer);
  const deleteUser = new DeleteUser(
    inMemoryUserRepository,
    inMemoryFollowRepository,
    inMemoryAnswerRepository
  );

  it("should delete user", async () => {
    const followed = new Followed({
      id: "156489sdfsdf8486",
      userId: "12345",
      addedBy: "5555",
    });

    const answer = new Answer({
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

    db.set(user.props.id, user);
    dbAnswer.set(answer.props.answerId, answer);
    dbFollow.set(followed.props.id, followed);
    
    await deleteUser.execute({
      userId: "12345",
    });
    expect(db.get("12345")).toBeFalsy();
    expect(dbAnswer.get("12345")).toBeFalsy();
    expect(dbFollow.get("12345")).toBeFalsy();
  });
});
