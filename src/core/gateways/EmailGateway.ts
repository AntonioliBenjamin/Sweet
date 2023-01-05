export interface EmailGateway {
    sendRecoveryCode(payload: {email: string, resetLink: string, userName: string}): void;
    sendFeedback(payload: {message: string, email: string}): void
}