import { BcryptGateway } from "../BcryptGateway";


describe("Unit - BcryptGateway", () => {
    const bcryptGateway = new BcryptGateway()
   
 
    it("should encrypt a password", () => {
        const result = bcryptGateway.encrypt("12345")
        expect(result).not.toEqual("12345")
    })

    it("should compare two passwords", () => {
        const result = bcryptGateway.encrypt("12345")
        expect(bcryptGateway.decrypt("12345", result)).toBeTruthy
    })
})