import {PasswordGateway} from "../../../gateways/PasswordGateway";

export class BcryptGateway implements PasswordGateway {
    encrypt(password: string): string {
        return password;
    };

    decrypt(password: string, hash: string): boolean {
        return password === hash;
    }
}