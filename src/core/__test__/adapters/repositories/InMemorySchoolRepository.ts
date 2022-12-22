import {SchoolRepository} from "../../../repositories/SchoolRepository";
import {School} from "../../../Entities/School";

export class InMemorySchoolRepository implements SchoolRepository {
    constructor(
        private readonly db: Map<string, School>
    ) {
    }

    getAllSchools(): Promise<School[]> {
        return Promise.resolve(Array.from(this.db.values()));
    }

    getBySchoolId(schoolId: string): School {
        return this.db.get(schoolId);
    }
}
