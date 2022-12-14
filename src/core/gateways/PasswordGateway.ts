export interface PasswordGateway {
    encrypt(password: string): string;

    decrypt(password: string, hash: string): boolean;
}