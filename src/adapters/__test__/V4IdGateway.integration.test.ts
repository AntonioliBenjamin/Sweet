import { V4IdGateway } from "../gateways/V4IdGateway";

describe("Unit - V4IdGateway", () => {
  it("should create an unique id", () => {
    const v4IdGateway = new V4IdGateway();

    const result = v4IdGateway.generate();
    expect(result.length).toBeGreaterThan(0);
  });
});
