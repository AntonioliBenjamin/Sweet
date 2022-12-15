export interface EmailGateway {
    sendRecoveryCode(email: string, code: string): void
}