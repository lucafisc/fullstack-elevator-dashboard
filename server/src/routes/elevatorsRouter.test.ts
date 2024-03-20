const request = require("supertest");
const app = require("../index").default;

describe("GET /elevators", () => {
  let response: any;

  beforeAll(async () => {
    response = await request(app).get("/elevators");
  });

  test("It should respond with status 200 and return an array of elevators", async () => {
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Each elevator should have the required properties", async () => {
    response.body.forEach((elevator: any) => {
      expect(elevator).toHaveProperty("specifications");
      expect(elevator.specifications).toHaveProperty("fabricationNumber");
      expect(elevator.specifications).toHaveProperty("address");
      expect(elevator.specifications).toHaveProperty(
        "deviceIdentificationNumber"
      );
      expect(elevator.specifications).toHaveProperty("manufacturerName");
      expect(elevator.specifications).toHaveProperty("productionYear");
      expect(elevator.specifications).toHaveProperty("elevatorType");
      expect(elevator).toHaveProperty("operationalState");
      expect(elevator.operationalState).toHaveProperty("floorNumber");
      expect(elevator.operationalState).toHaveProperty("state");
    });
  });

  test('If an elevator has status "warning", it should have a warning message', async () => {
    response.body.forEach((elevator: any) => {
      if (elevator.operationalState.state === "warning") {
        expect(elevator.operationalState).toHaveProperty("warningMessage");
      }
    });
  });

  test('If an elevator has status "out-of-order", it should have a reason', async () => {
    response.body.forEach((elevator: any) => {
      if (elevator.operationalState.state === "out-of-order") {
        expect(elevator.operationalState).toHaveProperty("reason");
      }
    });
  });

  test("It should respond with status 404 for wrong endpoint", async () => {
    const response404 = await request(app).get("/elevator");
    expect(response404.status).toBe(404);
  });
});

describe("GET /elevators/state/count", () => {
  let response: any;

  beforeAll(async () => {
    response = await request(app).get("/elevators/state/count");
  });

  test("It should respond with status 200 and return an object with the count of elevators by state", async () => {
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("operational");
    expect(response.body).toHaveProperty("out-of-order");
    expect(response.body).toHaveProperty("warning");
  });

  test("It should respond with number of elevators by state", async () => {
    expect(typeof response.body["operational"]).toBe("number");
    expect(typeof response.body["out-of-order"]).toBe("number");
    expect(typeof response.body["warning"]).toBe("number");
  });
});