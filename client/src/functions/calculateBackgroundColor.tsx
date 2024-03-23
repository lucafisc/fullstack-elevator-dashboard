export default function calculateBackgroundColor(state: string) {
  let bgColor = "";

  switch (state) {
    case "operational":
      bgColor = "bg-green-900";
      break;
    case "out-of-order":
      bgColor = "bg-red-900";
      break;
    case "warning":
      bgColor = "bg-yellow-900";
      break;
    default:
      bgColor = "bg-gray-950";
  }

  return bgColor;
}
