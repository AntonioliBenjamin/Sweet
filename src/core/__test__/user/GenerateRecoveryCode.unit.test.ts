import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { Gender, User } from "../../Entities/User";
import { GenerateRecoveryCode } from "../../usecases/user/GenerateRecoveryCode";

const db = new Map<string, User>();

describe("unit - GenerateRecoveryCode", () => {

  it("should generate a recovery code", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const uuidGateway = new UuidGateway();
    const updateRecoveryCode = new GenerateRecoveryCode(
      inMemoryUserRepository,
      uuidGateway
    );

    const user = new User({
      userName: "JOJO",
      firstName: "gerard",
      lastName: "bouchard",
      schoolId: "6789",
      section: "2e",
      age: 13,
      gender: Gender.BOY,
      email: "jojo@gmail.com",
      password: "1234",
      id: "1234",
      createdAt: new Date(),
      updatedAt: null,
    });

    db.set("1234", user);
    
    await updateRecoveryCode.execute({
      email: "jojo@gmail.com",
    });
    
    expect(user.props.recoveryCode).toBeTruthy();
  });
});
