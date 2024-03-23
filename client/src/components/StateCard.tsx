type Props = {
  state: string;
  count: number;
};

export default function StateCard({ state, count }: Props) {
  let bgColor = '';

  switch (state) {
    case 'operational':
      bgColor = 'bg-green-900';
      break;
    case 'out-of-order':
      bgColor = 'bg-red-900';
      break;
    case 'warning':
      bgColor = 'bg-yellow-900';
      break;
    default:
      bgColor = 'bg-gray-950';
  }

  return (
    <div className={`rounded-lg p-4 w-full sm:max-w-sm cursor-pointer shadow-md ${bgColor}`}>
      <p>Total {state}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}
