import { Link } from "react-router-dom";
import { Elevator } from "../../types/ElevatorType";
import StatusCircle from "../ui/ElevatorStatusCircle";
import ElevatorSpecs from "../ui/ElevatorSpecs";

type Props = {
  elevator: Elevator;
};

export default function ElevatorCard({ elevator }: Props) {
  return (
    <Link
      to={`/elevator/${elevator._id}`}
      className="bg-primary border border-outline rounded-3xl sm:h-40 flex items-center justify-start p-6 cursor-pointer hover:brightness-125 transition-all active:scale-95"
    >
      <StatusCircle state={elevator.operationalState.state} />
      <ElevatorSpecs elevator={elevator} />
    </Link>
  );
}
