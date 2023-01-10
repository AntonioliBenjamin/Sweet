import { SchoolDbRepository } from "../repositories/school/SchoolDbRepository";
import {myContainer} from "../container/inversify.config";
import {identifiers} from "../../core/identifiers/identifiers";

describe("Integration - SchoolRepository", () => {
  let schoolDbRepository: SchoolDbRepository;
  
  beforeAll(() => {
    schoolDbRepository = myContainer.get(identifiers.SchoolRepository);
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
