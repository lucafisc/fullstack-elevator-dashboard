import { render } from "@testing-library/react";
import GridContainer from "../GridContainer";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";

describe("GridContainer component", () => {
  test("renders children", () => {
    const { getByTestId } = render(
      <GridContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </GridContainer>,
    );

    const gridContainerElement = getByTestId("grid-container");
    expect(gridContainerElement).toBeInTheDocument();
    expect(gridContainerElement.children).toHaveLength(2);
  });

  test("renders no children", () => {
    const { getByTestId } = render(
      <GridContainer children={undefined}></GridContainer>,
    );

    const gridContainerElement = getByTestId("grid-container");
    expect(gridContainerElement).toBeInTheDocument();
    expect(gridContainerElement.children).toHaveLength(0);
  });
});
