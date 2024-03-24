import { render, cleanup } from '@testing-library/react';
import ElevatorSpecs from '../ElevatorSpecs';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {expect, describe} from '@jest/globals';
import type { Elevator } from "../../../types/ElevatorType";


describe('ElevatorSpecs component', () => {
    afterEach(() => {
        cleanup();
    });

    test('renders with correct specifications and operational state', () => {
        const elevator: Elevator = {
            operationalState: {
                state: 'operational',
                floorNumber: 1
            },
            specifications: {
                deviceIdentificationNumber: '123',
                address: '123 Main St',
                manufacturerName: 'Otis',
                fabricationNumber: '456',
                productionYear: 2021,
                elevatorType: 'Passenger'
            },
            _id: '1',
        };

        const { getByTestId } = render(<ElevatorSpecs elevator={elevator} />);
        const specsElement = getByTestId('elevator-specs');
        expect(specsElement).toBeInTheDocument();
    });

    test('renders with correct warning state', () => {
        const elevator: Elevator = {
            operationalState: {
                state: 'warning',
                floorNumber: 1,
                warningMessage: 'Warning message'
            },
            specifications: {
                deviceIdentificationNumber: '123',
                address: '123 Main St',
                manufacturerName: 'Otis',
                fabricationNumber: '456',
                productionYear: 2021,
                elevatorType: 'Passenger'
            },
            _id: '1',
        };

        const { getByText } = render(<ElevatorSpecs elevator={elevator} />);
        const warningElement = getByText('Warning message');
        expect(warningElement).toBeInTheDocument();
    });

    test('renders with correct out-of-order state', () => {
        const elevator: Elevator = {
            operationalState: {
                state: 'out-of-order',
                floorNumber: 1,
                reason: 'Out of order reason'
            },
            specifications: {
                deviceIdentificationNumber: '123',
                address: '123 Main St',
                manufacturerName: 'Otis',
                fabricationNumber: '456',
                productionYear: 2021,
                elevatorType: 'Passenger'
            },
            _id: '1',
        };

        const { getByText } = render(<ElevatorSpecs elevator={elevator} />);
        const outOfOrderElement = getByText('Out of order reason');
        expect(outOfOrderElement).toBeInTheDocument();
    });
});
