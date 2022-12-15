import {SchoolRepository} from "../../../core/repositories/SchoolRepository";

export type dbProperties = {
    fields: {
        nom_etablissement: string,
        code_commune: String,
    }
    recordid: string
}


export class SchoolDbRepository implements SchoolRepository {

    constructor(private readonly db: dbProperties[]) {
    }

    getSchoolId(nameOfSchool: string, zipCodeOfSchool: string): Promise<string> {
        const school = this.db.find(elm => elm.fields.nom_etablissement.toLowerCase().trim() === nameOfSchool.toLowerCase().trim() &&
            elm.fields.code_commune.trim() === zipCodeOfSchool.trim()).recordid
        return Promise.resolve(school);
    }
}

