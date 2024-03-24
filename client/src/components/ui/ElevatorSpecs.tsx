import { Elevator } from "../../types/ElevatorType";

type Props = {
  elevator: Elevator;
};

export default function ElevatorSpecs({ elevator }: Props) {
  const { specifications, operationalState } = elevator;
  let stateDiv = null;

  switch (operationalState.state) {
    case "warning":
      stateDiv = (
        <p className="italic text-yellow-300">
          {operationalState.warningMessage}
        </p>
      );
      break;
    case "out-of-order":
      stateDiv = (
        <p className="italic text-red-500">{operationalState.reason}</p>
      );
      break;
    default:
      stateDiv = <br />;
  }
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full">
      <div>
        <h2 className="font-bold text-xl">
          {specifications.deviceIdentificationNumber}
        </h2>
        <p>{specifications.address}</p>
        <p>
          {specifications.manufacturerName +
            " | " +
            specifications.fabricationNumber +
            " | " +
            specifications.productionYear}
        </p>
      </div>
      <div className="sm:text-right">
        <br />
        {stateDiv}
        <p>floor: {operationalState.floorNumber}</p>
      </div>
    </div>
  );
}
