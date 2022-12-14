import { Gender } from "./../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { User } from "../../Entities/User";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { UserErrors } from "../../errors/UserErrors";

const db = new Map<string, User>();

describe("Unit - SignUp", () => {
  let signUp: SignUp;

  beforeAll(() => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const uuidGateway = new UuidGateway();
    const bcryptGateway = new BcryptGateway();
    signUp = new SignUp(inMemoryUserRepository, uuidGateway, bcryptGateway);
  });

 afterEach(() => {
    db.clear()
  }); 

  it("should create user", async () => {
    const result = await signUp.execute({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "5678",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
    });
    expect(result.props.id).toBeTruthy();
    expect(result.props.userName).toEqual("jojo");
  });

  it("should throw if user already exists", async () => {
    await signUp.execute({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "5678",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
    });
  const result = () =>
    signUp.execute({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "5678",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
    });
  expect(() => result()).rejects.toThrow();
  });

  it("should throw because too young", async () => {
    const result =
    () =>  signUp.execute({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "5678",
      section: "2e",
      age: 11,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
    });
    expect(() => result()).rejects.toThrow(UserErrors.TooYoung);
  });
});



