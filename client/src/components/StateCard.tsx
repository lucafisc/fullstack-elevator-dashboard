import { Link } from "react-router-dom";
import calculateBackgroundColor from "../functions/calculateBackgroundColor";

type Props = {
  state: string;
  count: number;
};

export default function StateCard({ state, count }: Props) {
  const bgColor = calculateBackgroundColor(state);

  return (
    <Link
      to={`/state/${state}`}
      className={`rounded-lg p-4 w-full sm:max-w-sm cursor-pointer shadow-md ${bgColor} hover:brightness-125 active:scale-95 transition-all`}
    >
      <div>
        <p>Total {state}</p>
        <p className="text-3xl font-bold">{count}</p>
      </div>
    </Link>
  );
}
