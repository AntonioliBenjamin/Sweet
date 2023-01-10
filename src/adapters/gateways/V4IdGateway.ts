import "reflect-metadata";
import {v4} from "uuid";
import {IdGateway} from "../../core/gateways/IdGateway";
import {injectable} from "inversify";

@injectable()
export class V4IdGateway implements IdGateway {
    generate(): string {
        return v4();
    }
}