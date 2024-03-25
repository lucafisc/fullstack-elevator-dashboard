import { cleanup, render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import StateCard from "../StateCard";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { expect, describe } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";

describe("StateCard component", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders with correct state and count", () => {
    const state = "operational";
    const count = 10;

    render(
      <MemoryRouter>
        <StateCard state={state} count={count} />
      </MemoryRouter>,
    );

    expect(screen.getByText(`Total ${state}`)).toBeInTheDocument(); // Use the toBeInTheDocument function
    expect(screen.getByText(count.toString())).toBeInTheDocument();
  });

  test("renders with correct background color based on state", () => {
    const stateColorPairs = [
      { state: "operational", colorClass: "border-green-900" },
      { state: "out-of-order", colorClass: "border-red-900" },
      { state: "warning", colorClass: "border-yellow-900" },
      { state: "unknown", colorClass: "border-outline" },
    ];

    stateColorPairs.forEach(({ state, colorClass }) => {
      const count = 10;
      render(
        <MemoryRouter>
          <StateCard state={state} count={count} />
        </MemoryRouter>,
      );
      const linkElement = screen.getByTestId("state-card-link");
      expect(linkElement).toHaveClass(colorClass);
      cleanup();
    });
  });
});
