import { Mapper } from "../../../../core/models/Mapper";
import { School } from "../../../../core/Entities/School";

export type schoolModel = {
  fields: {
    nom_etablissement: string;
    libelle_region: string;
    nom_commune: string;
  };
  recordid: string;
};

export class DbSchoolMapper implements Mapper<schoolModel, School> {
  toDomain(raw: schoolModel): School {
    return new School({
      id: raw.recordid,
      name: raw.fields.nom_etablissement,
      city: raw.fields.nom_commune,
      district: raw.fields.libelle_region,
    });
  }
}
