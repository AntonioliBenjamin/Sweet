import {SchoolDbRepository} from "../repositories/school/SchoolDbRepository";

describe ('Integration - SchoolRepository', () => {
    const schoolDb = require('../repositories/mongoDb/school/schoolsDb.json');
const schoolDbRepository= new SchoolDbRepository(schoolDb);

    it("should find school Id ", async() => {
        console.log(schoolDb)
        const schoolId = await schoolDbRepository.getSchoolId("  lycée polyValent Application de l'Enna - Lycée des métiers des structures métalliques","93066");
        expect(schoolId).toBeTruthy();
    })
})