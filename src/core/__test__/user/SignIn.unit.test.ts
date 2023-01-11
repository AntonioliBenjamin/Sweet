import 'reflect-metadata';
import { SignIn } from "../../usecases/user/SignIn";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { Gender, User } from "../../Entities/User";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { SignUp } from "../../usecases/user/SignUp";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { InMemorySchoolRepository } from "../adapters/repositories/InMemorySchoolRepository";
import { School } from "../../Entities/School";
import {UserErrors} from "../../errors/UserErrors";

const db = new Map<string, User>();
const dbSchool = new Map<string, School>();

describe("Unit - SignUp", () => {
  let signUp: SignUp;
  let signIn: SignIn;
  let school: School;
  let user: User;

  beforeEach(async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const inMemorySchoolRepository = new InMemorySchoolRepository(dbSchool);
    const uuidGateway = new UuidGateway();
    const bcryptGateway = new BcryptGateway();

    signUp = new SignUp(
      inMemoryUserRepository,
      inMemorySchoolRepository,
      uuidGateway,
      bcryptGateway
    );

    signIn = new SignIn(bcryptGateway, inMemoryUserRepository);

    school = new School({
      id: "6789",
      city: "Paris",
      name: "ENA",
      district: "idf",
    });

    dbSchool.set("6789", school);

    user = await signUp.execute({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "6789",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
    });
  });

  afterEach(() => {
    db.clear();
    dbSchool.clear();
  });

  it("should connect user", async () => {
    const result = await signIn.execute({
      email: "jojo@gmail.com",
      password: "1234",
    });

    expect(result.props.userName).toEqual("jojo");
    expect(result.props.email).toEqual("jojo@gmail.com");
  });

  it("should throw if email not found", async () => {
    const result = () =>
      signIn.execute({
        email: "mimi@gmail.com",
        password: "1234",
      });

    await expect(() => result()).rejects.toThrow(UserErrors.WrongEmail);
  });

  it("should throw if password doesnt match", async () => {
    const result = () =>
      signIn.execute({
        email: "jojo@gmail.com",
        password: "5678",
      });
      
    await expect(() => result()).rejects.toThrow(UserErrors.WrongPassword);
  });
});
