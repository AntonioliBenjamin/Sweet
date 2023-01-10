import "reflect-metadata";
import { inject, injectable } from "inversify";
import {IdGateway} from "../../../gateways/IdGateway";
import {v4} from "uuid";


@injectable()
export class UuidGateway implements IdGateway {
    generate(): string {
        return v4();
    }
}


