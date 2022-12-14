import { IdGateway } from "../../../gateways/IdGateway";
import {v4} from "uuid";

export class UuidGateway implements IdGateway {
    generate(): string {
        return v4();
    }
}


