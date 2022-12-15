import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {ResetPassword} from "../../usecases/user/ResetPassword";
import {Gender, User} from "../../Entities/User";


const db = new Map();





describe('Unit - ResetPassword', () => {
    let userId: string;
    let resetPassword : ResetPassword;
    let user : User;

    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db);
        resetPassword = new ResetPassword(inMemoryUserRepository)

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
        expect(user.props.password).toEqual("nouveau mot de passe")
    })
})