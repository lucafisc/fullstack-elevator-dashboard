import calculateColor from "../../utils/calculateColor";

type Props = {
  state: string;
};

export default function StatusCircle({ state }: Props) {
  const borderColor = calculateColor(state);

  return (
    <div
      className={`h-8 aspect-square rounded-full bg-outline border-2 ${borderColor} mr-6`}
    ></div>
  );
}
