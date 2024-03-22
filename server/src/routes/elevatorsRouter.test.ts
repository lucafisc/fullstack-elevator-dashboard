import { cp } from "fs";

const request = require("supertest");
const app = require("../index").default;
const stateEnum = require("../db/elevator").stateEnum;

describe("GET /test", () => {
  let response: any;

  beforeAll(async () => {
    response = await request(app).get("/test");
  });

  test("It should return an array of elevators and response status 200", async () => {
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
});

describe("GET /test/state/count", () => {
  let response: any;

  beforeAll(async () => {
    response = await request(app).get("/test/state/count");
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

describe("GET /test/state/:state", () => {
  let response: any;

  const getElevatorsByState = async (state: string) => {
    return await request(app).get(`/test/state/${state}`);
  };

  test("It should respond with status 200 and return an array of elevators in the specified state", async () => {
    for (let state of stateEnum) {
      response = await getElevatorsByState(state);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((elevator: any) => {
        expect(elevator.operationalState.state).toBe(state);
      });
    }
  });

  test("It should respond with status 404 if the state is not valid", async () => {
    response = await getElevatorsByState("invalid-state");
    expect(response.status).toBe(404);
  });
});

describe("GET /test/:id", () => {
  let response: any;
  let elevators: any;
  let elevatorWithChart: any;

  beforeAll(async () => {
    elevators = await request(app).get("/test");
  });
  const getElevatorById = async (id: string) => {
    return await request(app).get(`/test/${id}`);
  };

  test("It should respond with status 200 and return the elevator with the specified id", async () => {
    const elevatorId = elevators.body[0]._id;
    response = await getElevatorById(elevatorId);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(elevatorId);
  });

  test("The elevator should have the chart populated", async () => {
    elevatorWithChart = elevators.body.find((elevator: any) => elevator.chart);
    if (elevatorWithChart) {
      response = await getElevatorById(elevatorWithChart._id);
      expect(response.body).toHaveProperty("chart");
      expect(response.body.chart).toHaveProperty("name");
      expect(response.body.chart).toHaveProperty("data");
    }
  });

  test("Elevator with chart with name 'door_cycle_count_over_time' should have an array of data with specific properties", async () => {
    expect(response.status).toBe(200);
    if (elevatorWithChart) {
      if (elevatorWithChart.chart.name === "door_cycle_count_over_time") {
        expect(Array.isArray(elevatorWithChart.chart.data)).toBe(true);
        elevatorWithChart.chart.data.forEach((data: any) => {
          expect(data).toHaveProperty("time");
          expect(data).toHaveProperty("door_cycles_count");
          expect(data).toHaveProperty("door_openings_count");
          expect(data).toHaveProperty("door_closings_count");
          expect(data).toHaveProperty("door_closed_count");
        });
      }
    }
  });

  test("It should respond with status 403 if the id is not valid", async () => {
    response = await getElevatorById("invalid-id");
    expect(response.status).toBe(403);
  });
});

describe("GET /test/recentlyVisited", () => {
  let response: any;
  let elevators: any;

  beforeAll(async () => {
    elevators = await request(app).get("/test");
  });

  const visitElevators = async (ids: string[]) => {
    for (let id of ids) {
      await request(app).get(`/test/${id}`);
    }
  };

 
  test("It should respond with status 200 and return an array of recently visited elevators", async () => {
    expect(elevators.status).toBe(200);
    if (elevators.body.length > 3) {
    //  Visit three elevators
    const ids = elevators.body.slice(0, 3).map((elevator: any) => elevator._id);
    await visitElevators(ids);

    // Get the three recently visited elevators
    response = await request(app).get("/test/recentlyVisited");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const visitedElevators = response.body.map((visited : any) => visited.elevator._id).slice(-3)

    expect(visitedElevators).toEqual(ids);
  }
});

test("It should respond with status 200 an return an array of recently randomly visited elevators", async () => {
  expect(elevators.status).toBe(200);
  if (elevators.body.length > 3) {
    // get three random unique ids from the elevators
    const ids : string[] = [];
    while (ids.length < 3) {
      const randomId = elevators.body[Math.floor(Math.random() * elevators.body.length)]._id;
      if (!ids.includes(randomId)) {
        ids.push(randomId);
      }
    }
    await visitElevators(ids);

    // Get the three recently visited elevators
    response = await request(app).get("/test/recentlyVisited");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const visitedElevators = response.body.map((visited : any) => visited.elevator._id).slice(-3);

    expect(visitedElevators).toEqual(ids);
  }
});
});