import {UseCase} from "../Usecase";
import {School} from "../../Entities/School";
import {SchoolRepository} from "../../repositories/SchoolRepository";


export class GetAllSchools implements UseCase<void, School[]> {

    constructor(private readonly schoolRepository: SchoolRepository) {
    }

    async execute(): Promise<School[]> {
        return this.schoolRepository.getAllSchools();
    }
}