import {FirebaseGateway} from "../gateways/FirebaseGateway";
import  * as admin from 'firebase-admin';


const app = admin.initializeApp();

jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn().mockImplementation(() => {
            return {
                messaging: jest.fn(() => {
                    return {
                        send: jest.fn().mockImplementation((...args) => {
                            const token = args[0].token;
                            if (!token) {
                                throw new Error('TOKEN_INVALID');
                            }
                            return args;
                        })
                    }
                })
            }
        })
    }
})

describe('Integration - FirebaseGateway', () => {
    let firebaseGateway: FirebaseGateway;

    beforeAll(() => {
        firebaseGateway = new FirebaseGateway(app)
    })

    it('Should send a push notification', async () => {
        await firebaseGateway.send({
            identifier: 'paozkepoazkea',
            title: 'hello',
            message: 'its me Goku'
        })
    })

    it('Should throw silently if token is missing', async () => {
        await firebaseGateway.send({
            identifier: null,
            title: 'hello',
            message: 'its me Goku'
        })
    })

})