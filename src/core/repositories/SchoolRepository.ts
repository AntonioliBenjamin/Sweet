import {School} from "../Entities/School";

export interface SchoolRepository {

    getBySchoolId(schoolId: string): Promise<School>;

    getAllSchools(): Promise<School[]>
}