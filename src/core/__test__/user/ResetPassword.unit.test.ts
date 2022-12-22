import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {ResetPassword} from "../../usecases/user/ResetPassword";
import {Gender, User} from "../../Entities/User";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";

const db = new Map();

describe('Unit - ResetPassword', () => {
    let resetPassword : ResetPassword;
    let user : User;
    let encryptionGateway: BcryptGateway

    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db);
        encryptionGateway = new BcryptGateway()
        resetPassword = new ResetPassword(inMemoryUserRepository, encryptionGateway)

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
            id: "0000",
            createdAt: new Date(),
            updatedAt: null,
            recoveryCode: "test123"
        })
        db.set("0000",user)
    })

    it('Should reset password', async () => {
        await resetPassword.execute({
            id: "0000",
            password: "nouveau mot de passe",
            recoveryCode: "test123",
        })

        const match = encryptionGateway.decrypt("nouveau mot de passe", user.props.password) 
        expect(match).toBeTruthy() 
    })
})