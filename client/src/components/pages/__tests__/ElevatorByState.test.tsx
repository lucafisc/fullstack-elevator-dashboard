import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import Routes
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import ElevatorByState from "../ElevatorByState";

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: jest.fn(),
}));

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("ElevatorByState component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches data from API and renders operational elevator cards", async () => {
    const elevators = [
      {
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
      {
        _id: "2",
        specifications: {
          deviceIdentificationNumber: "ID456",
          address: "456 Elm St",
          manufacturerName: "XYZ Elevators",
          fabricationNumber: "FAB789",
          productionYear: 2024,
          elevatorType: "Freight",
        },
        operationalState: {
          floorNumber: 3,
          state: "operational",
        },
      },
    ];

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });
    mockAxios.get.mockResolvedValue({ data: elevators });
    render(
      <MemoryRouter initialEntries={["/elevators/state/operational"]}>
        <ElevatorByState />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getTokenMock).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    elevators.forEach((elevator) => {
      const elevatorCard = screen.getByText(
        elevator.specifications.deviceIdentificationNumber
      );
      expect(elevatorCard).toBeInTheDocument();
      expect(elevator.operationalState.state).toBe("operational");
    });
  });

  test("fetches data from API and renders warning elevator cards", async () => {
    const elevators = [
      {
        _id: "3",
        specifications: {
          deviceIdentificationNumber: "ID789",
          address: "789 Oak St",
          manufacturerName: "123 Elevators",
          fabricationNumber: "FAB012",
          productionYear: 2025,
          elevatorType: "Passenger",
        },
        operationalState: {
          floorNumber: 2,
          state: "warning",
          warningMessage: "Elevator is moving slowly",
        },
      },
      {
        _id: "4",
        specifications: {
          deviceIdentificationNumber: "ID012",
          address: "012 Pine St",
          manufacturerName: "456 Elevators",
          fabricationNumber: "FAB345",
          productionYear: 2026,
          elevatorType: "Freight",
        },
        operationalState: {
          floorNumber: 4,
          state: "warning",
          warningMessage: "Elevator is not responding",
        },
      },
    ];

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });
    mockAxios.get.mockResolvedValue({ data: elevators });
    render(
      <MemoryRouter initialEntries={["/elevators/state/warning"]}>
        <ElevatorByState />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getTokenMock).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    elevators.forEach((elevator) => {
      const elevatorCard = screen.getByText(
        elevator.specifications.deviceIdentificationNumber
      );
      expect(elevatorCard).toBeInTheDocument();
      expect(elevator.operationalState.state).toBe("warning");
      const warningMessage = screen.getByText(
        elevator.operationalState.warningMessage
      );
      expect(warningMessage).toBeInTheDocument();
    });
  });

  test("fetches data from API and renders out-of-order elevator cards", async () => {
    const elevators = [
      {
        _id: "3",
        specifications: {
          deviceIdentificationNumber: "ID789",
          address: "789 Oak St",
          manufacturerName: "123 Elevators",
          fabricationNumber: "FAB012",
          productionYear: 2025,
          elevatorType: "Passenger",
        },
        operationalState: {
          floorNumber: 2,
          state: "out-of-order",
          reason: "Elevator is under maintenance",
        },
      },
      {
        _id: "4",
        specifications: {
          deviceIdentificationNumber: "ID012",
          address: "012 Pine St",
          manufacturerName: "456 Elevators",
          fabricationNumber: "FAB345",
          productionYear: 2026,
          elevatorType: "Freight",
        },
        operationalState: {
          floorNumber: 4,
          state: "out-of-order",
          reason: "Elevator is being repaired",
        },
      },
    ];

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });
    mockAxios.get.mockResolvedValue({ data: elevators });
    render(
      <MemoryRouter initialEntries={["/elevators/state/warning"]}>
        <ElevatorByState />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getTokenMock).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    elevators.forEach((elevator) => {
      const elevatorCard = screen.getByText(
        elevator.specifications.deviceIdentificationNumber
      );
      expect(elevatorCard).toBeInTheDocument();
      expect(elevator.operationalState.state).toBe("out-of-order");
      const reason = screen.getByText(elevator.operationalState.reason);
      expect(reason).toBeInTheDocument();
    });
  });
});
