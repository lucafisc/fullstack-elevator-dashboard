export default function calculateColor(state: string) {
  let bgColor = "";

  switch (state) {
    case "operational":
      bgColor = "border-green-900";
      break;
    case "out-of-order":
      bgColor = "border-red-900";
      break;
    case "warning":
      bgColor = "border-yellow-900";
      break;
    default:
      bgColor = "border-gray-950";
  }

  return bgColor;
}
