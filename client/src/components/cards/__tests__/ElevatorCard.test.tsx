import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ElevatorCard from "../ElevatorCard";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { expect, describe } from "@jest/globals";
import type { Elevator } from "../../../types/ElevatorType";

describe("ElevatorCard component", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders a link to the correct location", () => {
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
        <ElevatorCard elevator={elevator} />
      </MemoryRouter>,
    );

    const linkElement = getByTestId("elevator-card");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute("href")).toBe(`/elevator/${elevator._id}`);
  });
});
