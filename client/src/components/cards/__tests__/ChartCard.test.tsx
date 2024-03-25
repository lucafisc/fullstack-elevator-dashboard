import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChartCard from "../ChartCard";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { expect, describe } from "@jest/globals";
import type { Elevator } from "../../../types/ElevatorType";

jest.mock("@mui/x-charts/LineChart", () => ({
  __esModule: true,
  LineChart: jest.fn().mockReturnValue(null),
}));

describe("ChartCard component", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders No charts available for this elevator if chart data i not present", () => {
    const elevator: Elevator = {
      _id: "1",
      specifications: {
        deviceIdentificationNumber: "ID123",
        address: "123 Main St",
        manufacturerName: "ABC Elevators",
        fabricationNumber: "FAB456",
        productionYear: 2023,
        elevatorType: "Passenger",
      },
      operationalState: {
        floorNumber: 5,
        state: "operational",
      },
    };

    const { getByTestId } = render(
      <MemoryRouter>
        <ChartCard elevator={elevator} />
      </MemoryRouter>,
    );

    const chartElement = getByTestId("chart-card");
    expect(chartElement).toBeInTheDocument();
    expect(chartElement).toHaveTextContent(
      "No charts available for this elevator",
    );
  });

  test("renders the chart name if chart data is present", () => {
    const elevator: Elevator = {
      _id: "1",
      specifications: {
        deviceIdentificationNumber: "ID123",
        address: "123 Main St",
        manufacturerName: "ABC Elevators",
        fabricationNumber: "FAB456",
        productionYear: 2023,
        elevatorType: "Passenger",
      },
      operationalState: {
        floorNumber: 5,
        state: "operational",
      },
      chart: {
        name: "Elevator Chart",
        data: [
          {
            time: "2023-09-01T00:00:00.000Z",
            door_closed_count: 1,
            door_closings_count: 2,
            door_cycles_count: 3,
            door_opened_count: 4,
            door_openings_count: 5,
          },
        ],
      },
    };

    const { getByTestId } = render(
      <MemoryRouter>
        <ChartCard elevator={elevator} />
      </MemoryRouter>,
    );

    const chartElement = getByTestId("chart-card");
    expect(chartElement).toBeInTheDocument();
    expect(chartElement).toHaveTextContent("Elevator Chart");
  });
});
