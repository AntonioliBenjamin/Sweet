import "reflect-metadata";
import { inject, injectable } from "inversify";
import {PasswordGateway} from "../../../gateways/PasswordGateway";


@injectable()
export class BcryptGateway implements PasswordGateway {
    encrypt(password: string): string {
        return password;
    };

    decrypt(password: string, hash: string): boolean {
        return password === hash;
    }
}