import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import ElevatorOverview from "../ElevatorOverview";
import { RecentlyVisited } from "../../../types/ElevatorType";

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: jest.fn(),
}));

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("ElevatorOverview component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches state data from API and renders StateCard components", async () => {
    const elevatorStateCount = {
      operational: 5,
      "out-of-order": 2,
      warning: 3,
    };

    const elevators: RecentlyVisited[] = [
      {
        elevator: {
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
        },
        visitedAt: "2024-03-24T12:00:00Z",
      },
      {
        elevator: {
          _id: "2",
          specifications: {
            deviceIdentificationNumber: "ID456",
            address: "456 Elm St",
            manufacturerName: "DEF Elevators",
            fabricationNumber: "FAB789",
            productionYear: 2024,
            elevatorType: "Freight",
          },
          operationalState: {
            floorNumber: 3,
            state: "operational",
          },
        },
        visitedAt: "2024-03-24T12:00:00Z",
      },
    ];

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });

    mockAxios.get
      .mockResolvedValueOnce({ data: elevatorStateCount })
      .mockResolvedValueOnce({ data: elevators });

    render(
      <MemoryRouter>
        <ElevatorOverview />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    });

    Object.entries(elevatorStateCount).forEach(([state, count]) => {
      const stateCard = screen.getByText(`Total ${state}`);
      const countElement = screen.getByText(count.toString());
      expect(countElement).toBeInTheDocument();
      expect(stateCard).toBeInTheDocument();
    });
  });

  test("fetches recently viewed elevators from API and renders ElevatorCard components", async () => {
    const elevatorStateCount = {
      operational: 5,
      warning: 3,
      "out-of-order": 2,
    };

    const elevators: RecentlyVisited[] = [
      {
        elevator: {
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
        },
        visitedAt: "2024-03-24T12:00:00Z",
      },
      {
        elevator: {
          _id: "2",
          specifications: {
            deviceIdentificationNumber: "ID456",
            address: "456 Elm St",
            manufacturerName: "DEF Elevators",
            fabricationNumber: "FAB789",
            productionYear: 2024,
            elevatorType: "Freight",
          },
          operationalState: {
            floorNumber: 3,
            state: "operational",
          },
        },
        visitedAt: "2024-03-24T12:00:00Z",
      },
    ];

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });

    mockAxios.get
      .mockResolvedValueOnce({ data: elevatorStateCount })
      .mockResolvedValueOnce({ data: elevators });

    render(
      <MemoryRouter>
        <ElevatorOverview />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    });

    elevators.forEach((elevator) => {
      const elevatorCard = screen.getByText(
        elevator.elevator.specifications.deviceIdentificationNumber,
      );
      expect(elevatorCard).toBeInTheDocument();
    });
  });
});
