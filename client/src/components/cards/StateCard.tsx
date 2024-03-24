import { Link } from "react-router-dom";
import calculateBackgroundColor from "../../utils/calculateColor";

type Props = {
  state: string;
  count: number;
};

export default function StateCard({ state, count }: Props) {
  const bgColor = calculateBackgroundColor(state);

  return (
    <Link
      data-testid="state-card-link"
      to={`/state/${state}`}
      className={`rounded-lg bg-primary border p-4 w-full sm:max-w-sm cursor-pointer shadow-md ${bgColor} hover:brightness-125 active:scale-95 transition-all`}
    >
      <p>Total {state}</p>
      <p className="text-3xl font-bold">{count}</p>
    </Link>
  );
}
