import {UseCase} from "../Usecase";
import {School} from "../../Entities/School";
import {SchoolRepository} from "../../repositories/SchoolRepository";
import { inject, injectable } from "inversify";
import { identifiers } from "../../identifiers/identifiers";

@injectable()
export class GetAllSchools implements UseCase<void, School[]> {
    constructor(
        @inject(identifiers.SchoolRepository) private readonly schoolRepository: SchoolRepository
    ) {
    }

    async execute(): Promise<School[]> {
        return this.schoolRepository.getAllSchools();
    }
}