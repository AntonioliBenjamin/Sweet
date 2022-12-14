

import {SchoolRepository} from "../../../repositories/SchoolRepository";

export class InMemorySchoolRepository implements SchoolRepository {

    getSchoolId(nameOfSchool: string, zipCodeOfSchool: string): Promise<string> {

        return Promise.resolve(nameOfSchool + zipCodeOfSchool);
    }
}
