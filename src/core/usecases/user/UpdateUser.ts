import { inject, injectable } from "inversify";
import {UseCase} from "../Usecase";
import {Gender, User} from "../../Entities/User";
import {UserRepository} from "../../repositories/UserRepository";
import {SchoolErrors} from "../../errors/SchoolErrors";
import {SchoolRepository} from "../../repositories/SchoolRepository";
import { identifiers } from "../../identifiers/identifiers";

export type UserUpdatedInput = {
    userName: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    section: string;
    id: string;
    schoolId: string;
};

@injectable()
export class UpdateUser implements UseCase<UserUpdatedInput, User> {
    constructor(
        @inject(identifiers.UserRepository) private readonly userRepository: UserRepository,
        @inject(identifiers.SchoolRepository) private readonly schoolRepository: SchoolRepository,
    ) {}


    async execute(input: UserUpdatedInput): Promise<User> {
        const user = await this.userRepository.getById(input.id);

        const school = this.schoolRepository.getBySchoolId(input.schoolId);
        if (!school) {
            throw new SchoolErrors.NotFound();
        }

        user.update({
            gender: input.gender,
            firstName: input.firstName,
            lastName: input.lastName,
            section: input.section,
            userName: input.userName,
            schoolId: input.schoolId
        });

        await this.userRepository.update(user);

        return Promise.resolve(user);
    }
}
