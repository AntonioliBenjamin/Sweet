import {Gender, User} from "../../Entities/User";
import { EmailExist } from "../../usecases/user/EmailExist";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { userDb } from "../adapters/container/inversify.config";


describe("unit - GenerateRecoveryCode", () => {
    let emailExist: EmailExist
    let user: User;

    beforeAll(() => {
        
        emailExist = testContainer.get(identifiers.EmailExist)

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
        userDb.set("1234", user);

    })
    it("should return true if email exist", async () => {
        const result = await emailExist.execute("jojo@gmail.com");
        expect(result).toBeTruthy();
    });

    it("should return false if email dosen't exist", async () => {
        const result = await emailExist.execute("false@gmail.com");
        expect(result).toBeFalsy();
    });

});
