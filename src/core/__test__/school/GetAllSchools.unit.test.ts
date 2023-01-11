import 'reflect-metadata';
import { School } from "../../Entities/School";
import { InMemorySchoolRepository } from "../adapters/repositories/InMemorySchoolRepository";
import { GetAllSchools } from "../../usecases/school/GetAllSchools";

const db = new Map<string, School>();

describe("Unit - getAllSchools", () => {
  const inMemorySchoolRepository = new InMemorySchoolRepository(db);
  const getAllSchools = new GetAllSchools(inMemorySchoolRepository);

  it("should get all schools", async () => {
    const school = School.create({
      id: "6789",
      city: "Paris",
      name: "ENA",
      district: "idf",
    });

    const school2 = new School({
      id: "67890",
      city: "Paris2",
      name: "ENA2",
      district: "idf2",
    });

    db.set("6789", school);
    db.set("67890", school2);

    const result = await getAllSchools.execute();
    
    expect(result).toHaveLength(2);
  });
});
