import { V4IdGateway } from './../V4IdGateway';

describe("Unit - V4IdGateway", () => {
    const v4IdGateway = new V4IdGateway();
    it("should create an unique id", () => {
        const result = v4IdGateway.generate()
        expect(result.length).toBeGreaterThan(0);
    })
})