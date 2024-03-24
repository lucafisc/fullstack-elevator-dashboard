export function formatChartName(text: string) {
  const words = text.split("_");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
  }
  const transformedText = words.join("");
  return transformedText;
}
