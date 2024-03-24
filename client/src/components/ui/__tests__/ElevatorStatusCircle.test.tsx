import { render, cleanup } from '@testing-library/react';
import ElevatorStatusCircle from '../ElevatorStatusCircle';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {expect, describe} from '@jest/globals';

describe('ElevatorStatusCircle component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders with correct border color for "operational" state', () => {
    const state = 'operational';
    const { getByTestId } = render(<ElevatorStatusCircle state={state} />);
    const circleElement = getByTestId('elevator-status-circle');
    expect(circleElement).toHaveClass('border-green-900');
  });

  test('renders with correct border color for "out-of-order" state', () => {
    const state = 'out-of-order';
    const { getByTestId } = render(<ElevatorStatusCircle state={state} />);
    const circleElement = getByTestId('elevator-status-circle');
    expect(circleElement).toHaveClass('border-red-900');
  });

  test('renders with correct border color for "warning" state', () => {
    const state = 'warning';
    const { getByTestId } = render(<ElevatorStatusCircle state={state} />);
    const circleElement = getByTestId('elevator-status-circle');
    expect(circleElement).toHaveClass('border-yellow-900');
  });

  test('renders with default border color for unknown state', () => {
    const state = 'unknown';
    const { getByTestId } = render(<ElevatorStatusCircle state={state} />);
    const circleElement = getByTestId('elevator-status-circle');
    expect(circleElement).toHaveClass('border-outline');
  });
});
