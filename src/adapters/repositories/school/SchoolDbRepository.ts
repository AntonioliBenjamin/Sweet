import "reflect-metadata";
import { SchoolRepository } from "../../../core/repositories/SchoolRepository";
import { School } from "../../../core/Entities/School";
import { DbSchoolMapper } from "./mappers/DbSchoolMapper";
import {injectable} from "inversify";
const db = require("./schoolsDb.json");
const dbSchoolMapper = new DbSchoolMapper();

@injectable()
export class SchoolDbRepository implements SchoolRepository {
  async getAllSchools(): Promise<School[]> {

    return await db.map((elem) => dbSchoolMapper.toDomain(elem));
  }

  getBySchoolId(schoolId: string): School {
    const schoolModel = db.find((elem) => elem.recordid === schoolId);
    
    return dbSchoolMapper.toDomain(schoolModel);
  }
}
