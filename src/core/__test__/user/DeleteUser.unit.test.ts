import { Gender } from './../../Entities/User';
import {UuidGateway} from "../adapters/gateways/UuidGateway";
import {DeleteUser} from "../../Usecases/user/DeleteUser";
import {InMemoryUserRepository} from "../adapters/repositories/InMemoryUserRepository";
import {User} from "../../Entities/User";

const db = new Map<string, User>();

describe('Unit - deleteUser', () => {
    const inMemoryUserRepository = new InMemoryUserRepository(db);
    const deleteUser = new DeleteUser(inMemoryUserRepository)
    const uuidGateway = new UuidGateway()
    const id = uuidGateway.generate()

    it('should delete user', async () => {
        const user = await User.create({
            userName: "JOJO",
            email: "jojo@gmail.com",
            password: "1234",
            age: 13,
            firstName: "gdfgdfg",
            gender: Gender.BOY,
            lastName: "dfgdrfg",
            id: "12345",
            schoolId: "15854",
            section: "dfgdfg"
          });
        db.set(user.props.id, user)
        await deleteUser.execute({
            userId: "12345",
        });
        expect(db.get("12345")).toBeFalsy();
    });
})