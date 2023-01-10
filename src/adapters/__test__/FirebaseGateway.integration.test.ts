import {FirebaseGateway} from "../gateways/FirebaseGateway";
import  './mocks/firebase.mock';
import {app} from './mocks/firebase.mock'

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