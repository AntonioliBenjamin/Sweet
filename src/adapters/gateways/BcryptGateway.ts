import {PasswordGateway} from "../../core/gateways/PasswordGateway";
import bcrypt from "bcrypt";

export class BcryptGateway implements PasswordGateway {
    encrypt(password: string): string {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds)
    };
    decrypt(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
    
}