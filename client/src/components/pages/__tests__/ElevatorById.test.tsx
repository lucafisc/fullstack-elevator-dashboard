import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import ElevatorById from "../ElevatorById";

// Mock the LineChart component
jest.mock("@mui/x-charts/LineChart", () => ({
  __esModule: true,
  LineChart: jest.fn().mockReturnValue(null),
}));

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: jest.fn(),
}));

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("ElevatorById component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches data from API and renders elevator card and chart card", async () => {
    const elevator = {
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
        name: "Elevator Data",
        data: [
          {
            time: "2024-03-24T12:00:00Z",
            door_closed_count: 5,
            door_closings_count: 5,
            door_cycles_count: 5,
            door_opened_count: 5,
            door_openings_count: 5,
          },
        ],
      },
    };

    const getTokenMock = jest.fn().mockResolvedValue("mockToken");

    (useAuth0 as jest.Mock).mockReturnValue({
      getAccessTokenSilently: getTokenMock,
    });
    mockAxios.get.mockResolvedValue({ data: elevator });
    render(
      <MemoryRouter initialEntries={["/elevators/1"]}>
        <ElevatorById />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getTokenMock).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    const elevatorCard = screen.getByText(
      elevator.specifications.deviceIdentificationNumber,
    );
    expect(elevatorCard).toBeInTheDocument();
    const chartCard = screen.getByText("Elevator Data");
    expect(chartCard).toBeInTheDocument();
  });
});
