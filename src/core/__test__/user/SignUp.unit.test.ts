import { Gender } from "./../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { User } from "../../Entities/User";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { UserErrors } from "../../errors/UserErrors";
import { InMemorySchoolRepository } from "../adapters/repositories/InMemorySchoolRepository";
import { School } from "../../Entities/School";
import { SchoolErrors } from "../../errors/SchoolErrors";

const db = new Map<string, User>();
const dbSchool = new Map<string, School>();

describe("Unit - SignUp", () => {
  let signUp: SignUp;
  let school: School;

  beforeAll(() => {
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

    school = new School({
      id: "6789",
      city: "Paris",
      name: "ENA",
      district: "idf",
    });

    dbSchool.set("6789", school);
  });

  afterEach(() => {
    db.clear();
  });

  it("should create user", async () => {
    const result = await signUp.execute({
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

    expect(result.props.id).toBeTruthy();
    expect(result.props.userName).toEqual("jojo");
  });

  it("should throw because school not found", async () => {
    const result = () =>
      signUp.execute({
        userName: "JOJO",
        firstName: "gerard",
        lastName: "bouchard",
        schoolId: "false id",
        section: "2e",
        age: 13,
        gender: Gender.BOY,
        email: "jojo@gmail.com",
        password: "1234",
      });

    await expect(() => result()).rejects.toThrow(SchoolErrors.NotFound);
  });

  it("should throw if user already exists", async () => {
    await signUp.execute({
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

    const result = () =>
      signUp.execute({
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

    await expect(() => result()).rejects.toThrow();
  });

  it("should throw because too young", async () => {
    const result = () =>
      signUp.execute({
        userName: "JOJO",
        firstName: "gerard",
        lastName: "bouchard",
        schoolId: "6789",
        section: "2e",
        age: 11,
        gender: Gender.BOY,
        email: "jojo@gmail.com",
        password: "1234",
      });
      
    await expect(() => result()).rejects.toThrow(UserErrors.TooYoung);
  });
});
