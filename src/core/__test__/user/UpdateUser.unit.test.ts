import { Gender } from './../../Entities/User';
import { User } from "../../Entities/User";
import { SignUp } from "../../usecases/user/SignUp";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { UuidGateway } from "../adapters/gateways/UuidGateway";
import { BcryptGateway } from "../adapters/gateways/BcryptGateway";
import { UpdateUser } from "../../Usecases/user/UpdateUser";

const db = new Map<string, User>();


describe('Unit - UpdateUser', () => {
    let signUp: SignUp;
    let updateUser: UpdateUser;
    let bcryptGateway: BcryptGateway;

    beforeAll(() => {
        const inMemoryUserRepository = new InMemoryUserRepository(db);
        const uuidGateway = new UuidGateway();
        bcryptGateway = new BcryptGateway();
        updateUser = new UpdateUser(inMemoryUserRepository)
        signUp = new SignUp(
            inMemoryUserRepository, uuidGateway, bcryptGateway
        )
    });

    it('should update user', async () => {
        const user = await signUp.execute({
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

        const result = await updateUser.execute({
            userName: "JOJO",
            age: 13,
            firstName: "gdfgdfg",
            lastName: "dfgdrfg",
            section: "dfgdfg",
            id: user.props.id
          });
          expect(result.props.userName).toEqual("jojo");
          expect(result.props.email).toEqual("jojo@gmail.com");
          expect(bcryptGateway.decrypt("1234", result.props.password)).toEqual(true);
          expect(result.props.id).toEqual(user.props.id)
        })
})