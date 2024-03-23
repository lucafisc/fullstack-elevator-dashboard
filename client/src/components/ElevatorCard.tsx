import { Link } from "react-router-dom";
import calculateBackgroundColor from "../functions/calculateBackgroundColor";
import { Elevator } from "../types/ElevatorType";

type Props = {
  elevator: Elevator;
};

export default function ElevatorCard({ elevator }: Props) {
  const { specifications, operationalState } = elevator;
  const bgColor = calculateBackgroundColor(operationalState.state);
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
    <Link
      to={`/elevator/${elevator._id}`}
      className="bg-black rounded-3xl h-40 flex items-center justify-start p-6 cursor-pointer hover:bg-gray-900 transition-all active:scale-95"
    >
      <div className={`h-8 aspect-square rounded-full ${bgColor} mr-6`}></div>
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
      <div className="text-right ml-auto">
        <br />
        {stateDiv}
        <p>floor: {operationalState.floorNumber}</p>
      </div>
    </Link>
  );
}
