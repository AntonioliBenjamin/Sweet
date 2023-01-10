import { SignIn } from "../../usecases/user/SignIn";
import { Gender, User } from "../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { School } from "../../Entities/School";
import {UserErrors} from "../../errors/UserErrors";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { schoolDb } from "../adapters/container/inversify.config";
import { userDb } from "../adapters/container/inversify.config";


describe("Unit - SignUp", () => {
  let signUp: SignUp;
  let signIn: SignIn;
  let school: School;
  let user: User;

  beforeEach(async () => {

    signUp = testContainer.get(identifiers.SignUp)
    signIn = testContainer.get(identifiers.SignIn)

    

    school = new School({
      id: "6789",
      city: "Paris",
      name: "ENA",
      district: "idf",
    });

    schoolDb.set("6789", school);

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
    userDb.clear();
    schoolDb.clear();
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
