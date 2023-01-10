import {Gender} from "./../../Entities/User";
import {User} from "../../Entities/User";
import {SignUp} from "../../usecases/user/SignUp";
import {School} from "../../Entities/School";
import {GetUserById} from "../../usecases/user/GetUserById";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { schoolDb } from "../adapters/container/inversify.config";

describe("Unit - GetUserById", () => {
    let getUserById: GetUserById;
    let user: User;
    let result: User;


    beforeAll(async () => {
        getUserById = testContainer.get(identifiers.GetUserById)
        const signUp: SignUp = testContainer.get(identifiers.SignUp)

        const school = new School({
            id: "6789",
            city: "Paris",
            name: "ENA",
            district: "idf",
        });

        const school2 = new School({
            id: "1111",
            city: "Paris",
            name: "ENA",
            district: "idf",
        });

        schoolDb.set("6789", school);
        schoolDb.set("1111", school2);

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

        result = await getUserById.execute({
            userId : user.props.id
        });

    })

    it("should get user by Id", async () => {
        expect(result.props.userName).toEqual("jojo");
        expect(result.props.email).toEqual("jojo@gmail.com");
        expect(result.props.gender).toEqual("boy");
        expect(result.props.schoolId).toEqual("6789");
        expect(result.props.id).toEqual(user.props.id);
    });
});
