import calculateColor from "../../utils/calculateColor";

type Props = {
  state: string;
};

export default function ElevatorStatusCircle({ state }: Props) {
  const borderColor = calculateColor(state);

  return (
    <div
      data-testid="elevator-status-circle"
      className={`h-8 aspect-square rounded-full bg-outline border-2 ${borderColor} mr-6`}
    ></div>
  );
}
