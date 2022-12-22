import { Gender } from "./../../Entities/User";
import { User } from "../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { UpdateUser } from "../../Usecases/user/UpdateUser";
import { School } from "../../Entities/School";
import { InMemorySchoolRepository } from "../adapters/repositories/InMemorySchoolRepository";

const db = new Map<string, User>();
const dbSchool = new Map<string, School>();

describe("Unit - UpdateUser", () => {
  it("should update user", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const inMemorySchoolRepository = new InMemorySchoolRepository(dbSchool);
    const uuidGateway = new UuidGateway();
    const bcryptGateway = new BcryptGateway();
    const updateUser = new UpdateUser(inMemoryUserRepository);
    const signUp = new SignUp(
      inMemoryUserRepository,
      inMemorySchoolRepository,
      uuidGateway,
      bcryptGateway
    );

    const school = new School({
      id: "6789",
      city: "Paris",
      name: "ENA",
      district: "idf",
    });

    dbSchool.set("6789", school);

    const user = await signUp.execute({
      userName: "JOJO",
      email: "jojo@gmail.com",
      password: "1234",
      age: 13,
      firstName: "gdfgdfg",
      gender: Gender.BOY,
      lastName: "dfgdrfg",
      schoolId: "6789",
      section: "dfgdfg",
    });

    const result = await updateUser.execute({
      userName: "JOJO",
      age: 13,
      firstName: "gdfgdfg",
      lastName: "dfgdrfg",
      section: "dfgdfg",
      id: user.props.id,
    });

    expect(result.props.userName).toEqual("jojo");
    expect(result.props.email).toEqual("jojo@gmail.com");
    expect(bcryptGateway.decrypt("1234", result.props.password)).toEqual(true);
    expect(result.props.id).toEqual(user.props.id);
  });
});
