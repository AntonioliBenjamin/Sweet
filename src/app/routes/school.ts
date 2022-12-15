import { GetAllSchools } from './../../core/usecases/school/GetAllSchools';
import express from "express";
import { SchoolDbRepository } from '../../adapters/repositories/school/SchoolDbRepository';
import { authorization } from '../middlewares/JwtAuthorizationMiddleware';
const schoolRouter = express.Router();
const schoolDlRepositry = new SchoolDbRepository();
const getAllSchools = new GetAllSchools(schoolDlRepositry)

schoolRouter.use(authorization);

schoolRouter.get("/all", async (req, res) => {
    try {
        const schools = await getAllSchools.execute()
        return res.status(200).send(schools.map(elm => elm.props))
    } catch (err) {
        return res.status(400).send({
            message: "An error occured"
        })
    }
})

export { schoolRouter }