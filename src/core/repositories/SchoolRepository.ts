import {School} from "../Entities/School";

export interface SchoolRepository {

    getBySchoolId(schoolId: string): School;

    getAllSchools(): Promise<School[]>
}