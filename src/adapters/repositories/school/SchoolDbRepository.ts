import {SchoolRepository} from "../../../core/repositories/SchoolRepository";
import {School} from "../../../core/Entities/School";
import {DbSchoolMapper} from "./mappers/DbSchoolMapper";

const db = require('./schoolsDb.json')
const dbSchoolMapper = new DbSchoolMapper()

export class SchoolDbRepository implements SchoolRepository {

    async getAllSchools(): Promise<School[]> {
        return await db.map(elem => dbSchoolMapper.toDomain(elem));
    }

    async getBySchoolId(schoolId: string): Promise<School> {
        const schoolModel = await db.find(elem => elem.recordid === schoolId);
        return dbSchoolMapper.toDomain(schoolModel)
    }
}




