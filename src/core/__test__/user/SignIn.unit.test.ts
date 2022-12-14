import { SignIn } from "../../usecases/user/SignIn";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { Gender, User } from "../../Entities/User";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { SignUp } from "../../usecases/user/SignUp";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
const db = new Map<string, User>();

describe("Unit - SignIn", () => {
  let signUp: SignUp;
  let signIn: SignIn;
  let bcryptGateway: BcryptGateway;
  beforeAll(() => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const uuidGateway = new UuidGateway();
    bcryptGateway = new BcryptGateway();
    signIn = new SignIn(inMemoryUserRepository, bcryptGateway);
    signUp = new SignUp(
      inMemoryUserRepository,
      uuidGateway,
      bcryptGateway
    );
  });

  it("should connect user", async () => {
    await signUp.execute({
      userName: "JOJO",
      email: "jojo@gmail.com",
      password: "1234",
      age: 13,
      firstName: "gdfgdfg",
      gender: Gender.BOY,
      lastName: "dfgdrfg",
      schoolId: "1234",
      section: "dfgdfg"
    });
    const result = await signIn.execute({
      email: "jojo@gmail.com",
      password: "1234",
    });
    expect(result.props.userName).toEqual("jojo");
    expect(result.props.email).toEqual("jojo@gmail.com");
    expect(bcryptGateway.decrypt("1234", result.props.password)).toEqual(
      true
    );
  });

  it("should throw if email not found", async () => {
    const result = () =>
      signIn.execute({
        email: "mimi@gmail.com",
        password: "1234",
      });
    await expect(() => result()).rejects.toThrow();
  });

  it("should throw if password doesnt match", async () => {
    const result = () =>
      signIn.execute({
        email: "jojo@gmail.com",
        password: "5678",
      });
    await expect(() => result()).rejects.toThrow();
  });
});
