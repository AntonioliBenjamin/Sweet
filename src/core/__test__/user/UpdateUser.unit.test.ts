import { Gender } from "./../../Entities/User";
import { User } from "../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { UpdateUser } from "../../Usecases/user/UpdateUser";
import { School } from "../../Entities/School";
import { InMemorySchoolRepository } from "../adapters/repositories/InMemorySchoolRepository";
import { UserErrors } from "../../errors/UserErrors";

const db = new Map<string, User>();
const dbSchool = new Map<string, School>();

describe("Unit - UpdateUser", () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemorySchoolRepository: InMemorySchoolRepository;
  let uuidGateway: UuidGateway;
  let bcryptGateway: BcryptGateway;
  let updateUser: UpdateUser
  let user:  User;
  let result: User;



  beforeAll(async () => {
   inMemoryUserRepository = new InMemoryUserRepository(db);
   inMemorySchoolRepository = new InMemorySchoolRepository(dbSchool);
   uuidGateway = new UuidGateway();
   bcryptGateway = new BcryptGateway();
   updateUser = new UpdateUser(inMemoryUserRepository);
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

    user = await signUp.execute({
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

    result = await updateUser.execute({
      userName: "JOJO",
      age: 13,
      firstName: "gdfgdfg",
      lastName: "dfgdrfg",
      section: "dfgdfg",
      id: user.props.id,
    });

  })
  it("should update user", async () => {
    expect(result.props.userName).toEqual("jojo");
    expect(result.props.email).toEqual("jojo@gmail.com");
    expect(bcryptGateway.decrypt("1234", result.props.password)).toEqual(true);
    expect(result.props.id).toEqual(user.props.id);
  });

  it("should throw if user is too young", async () => {
    const tooYoung = () => updateUser.execute({
      userName: "JOJO",
      age: 11,
      firstName: "gdfgdfg",
      lastName: "dfgdrfg",
      section: "dfgdfg",
      id: user.props.id,
    });
    await expect(tooYoung).rejects.toThrow(UserErrors.TooYoung)
  })
});
