import 'reflect-metadata';
import { SchoolDbRepository } from "../repositories/school/SchoolDbRepository";

describe("Integration - SchoolRepository", () => {
  let schoolDbRepository: SchoolDbRepository;
  
  beforeAll(() => {
    schoolDbRepository = new SchoolDbRepository();
  });

  it("should get school by Id ", async () => {
    const school = schoolDbRepository.getBySchoolId(
      "0f87dd7e1c1d7fef5269f007c7b112a22f610cf7"
    );
    expect(school.props.district).toEqual("Ile-de-France");
  });

  it("should get all schools", async () => {
    const schools = await schoolDbRepository.getAllSchools();
    expect(schools[0].props.district).toEqual("Ile-de-France");
  });
});
