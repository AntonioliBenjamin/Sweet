import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SchoolRepository } from "../../../repositories/SchoolRepository";
import { School } from "../../../Entities/School";


@injectable()
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
