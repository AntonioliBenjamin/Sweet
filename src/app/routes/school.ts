import 'reflect-metadata';
import {GetAllSchools} from "../../core/usecases/school/GetAllSchools";
import express from "express";
import {SchoolDbRepository} from "../../adapters/repositories/school/SchoolDbRepository";

const schoolRouter = express.Router();
const schoolDbRepository = new SchoolDbRepository();
const getAllSchools = new GetAllSchools(schoolDbRepository);


schoolRouter.get("/", async (req, res) => {
    const schools = await getAllSchools.execute();

    return res.status(200).send(schools.map((elm) => elm.props));
});

export {schoolRouter};
