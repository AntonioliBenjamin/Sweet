import 'reflect-metadata';
import {GetAllSchools} from "../../core/usecases/school/GetAllSchools";
import { Response,Request } from "express";
import {SchoolDbRepository} from "../../adapters/repositories/school/SchoolDbRepository";

const schoolDbRepository = new SchoolDbRepository();
const getAllSchools = new GetAllSchools(schoolDbRepository);
import {Get, JsonController, Req, Res} from "routing-controllers";


@JsonController('/school')
export class SchoolController {
    @Get()
    async getAll(@Req() req: Request, @Res() res: Response) {
        const schools = await getAllSchools.execute();
        return res.status(200).send(schools.map((elm) => elm.props));
    }
}
