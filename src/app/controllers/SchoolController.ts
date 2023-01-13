import 'reflect-metadata';
import {GetAllSchools} from "../../core/usecases/school/GetAllSchools";
import { Response,Request } from "express";
import {Get, JsonController, Req, Res} from "routing-controllers";
import { injectable } from 'inversify';

@injectable()
@JsonController('/school')
export class SchoolController {
    constructor(
        private readonly _getAllSchools : GetAllSchools
    ) {}

    @Get('/')
    async getAll(@Req() req: Request, @Res() res: Response) {
        const schools = await this._getAllSchools.execute();
        return res.status(200).send(schools.map((elm) => elm.props));
    }
}
