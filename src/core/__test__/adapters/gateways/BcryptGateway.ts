const bcrypt = require('bcrypt');


import {PasswordGateway} from "../../../gateways/PasswordGateway";

export class BcryptGateway implements PasswordGateway {
    encrypt(password: string): string {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds)
    };
    decrypt(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}