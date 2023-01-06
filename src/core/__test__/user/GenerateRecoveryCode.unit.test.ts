import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {Gender, User} from "../../Entities/User";
import {GenerateRecoveryCode} from "../../usecases/user/GenerateRecoveryCode";
import {UserErrors} from "../../errors/UserErrors";

const db = new Map<string, User>();

describe("unit - GenerateRecoveryCode", () => {
    let generateRecoveryCode: GenerateRecoveryCode;
    let user: User;

    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db);
        const uuidGateway = new UuidGateway();
        generateRecoveryCode = new GenerateRecoveryCode(
            inMemoryUserRepository,
            uuidGateway
        );

        user = new User({
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

    })
    it("should generate a recovery code", async () => {
        await generateRecoveryCode.execute({
            email: "jojo@gmail.com",
        });

        expect(user.props.recoveryCode).toBeTruthy();
    });

    it("should throw because email is wrong", async () => {
        const result = () =>generateRecoveryCode.execute({
            email: "wrong email",
        });

        await expect(()=>result()).rejects.toThrow(UserErrors.WrongEmail);
    });


});
