import {Gender} from "./../../Entities/User";
import {User} from "../../Entities/User";
import {SignUp} from "../../usecases/user/SignUp";
import {UpdateUser} from "../../Usecases/user/UpdateUser";
import {School} from "../../Entities/School";
import {SchoolErrors} from "../../errors/SchoolErrors";
import { testContainer } from "../adapters/container/inversify.config";
import { identifiers } from "../../identifiers/identifiers";
import { schoolDb } from "../adapters/container/inversify.config";


describe("Unit - UpdateUser", () => {
    let updateUser: UpdateUser;
    let user: User;
    let result: User;
    let signUp: SignUp


    beforeAll(async () => {
        signUp = testContainer.get(identifiers.SignUp)
        updateUser = testContainer.get(identifiers.UpdateUser)     

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

        result = await updateUser.execute({
            userName: "JOJO",
            gender : Gender.GIRL,
            firstName: "gdfgdfg",
            lastName: "dfgdrfg",
            section: "dfgdfg",
            id: user.props.id,
            schoolId: "1111",
        });

    })
    it("should update user", async () => {
        expect(result.props.userName).toEqual("jojo");
        expect(result.props.email).toEqual("jojo@gmail.com");
        expect(result.props.gender).toEqual("girl");
        expect(result.props.schoolId).toEqual("1111");
        expect(result.props.id).toEqual(user.props.id);
    });

    it("should throw if user is too young", async () => {
        const wrongSchoolId = () => updateUser.execute({
            userName: "JOJO",
            gender :Gender.GIRL,
            firstName: "gdfgdfg",
            lastName: "dfgdrfg",
            section: "dfgdfg",
            id: user.props.id,
            schoolId : "wrong schoolId",
        });
        await expect(wrongSchoolId).rejects.toThrow(SchoolErrors.NotFound)
    })
});
