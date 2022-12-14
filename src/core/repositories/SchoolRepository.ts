export interface SchoolRepository {

    getSchoolId (nameOfSchool: string, zipCodeOfSchool:string) : Promise<string>;
}