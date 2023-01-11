import 'reflect-metadata';
import {SendGridGateway} from "../gateways/SendGridGateway";
import {MailService} from "@sendgrid/mail";

jest.mock('@sendgrid/mail', () => {
    return {
        MailService: jest.fn(() => {
            return {
                send: jest.fn().mockImplementation()
            }
        })
    }
})

const mailService = new MailService();

describe('Integration - SendGridGateway', () => {
    let sendgridGateway: SendGridGateway;

    beforeAll(() => {
        sendgridGateway = new SendGridGateway(
            mailService,
            'cedric@hello.com'
        );
    })

    it('Should send feedback', async () => {
        const spyOnSendMethod = jest.spyOn(mailService, 'send');
        await sendgridGateway.sendFeedback({
            email: 'benjamin@hello.com',
            message: 'Hello, j\'adore l\'app'
        });
        expect(spyOnSendMethod).toHaveBeenCalledWith({"dynamicTemplateData": {"message": "Hello, j'adore l'app"}, "from": {"email": "cedric@hello.com", "name": "Sweet Dev"}, "templateId": "d-f6e42c62ae494789965870a9af270a2e", "to": "cedric@hello.com"});
    })

    it('Should send a recovery code', async () => {
        const spyOnSendMethod = jest.spyOn(mailService, 'send');
        await sendgridGateway.sendRecoveryCode({
            email: 'hello@hello.com',
            userName: 'user',
            resetLink: 'http://localhost:3000'
        })
        expect(spyOnSendMethod).toHaveBeenCalledWith({"dynamicTemplateData": {"name": "user", "reset_password_link": "http://localhost:3000"}, "from": {"email": "cedric@hello.com", "name": "Sweet Dev"}, "templateId": "d-84cfb4f9b5c24788b11df0f56a9acdba", "to": "hello@hello.com"})
    })
})