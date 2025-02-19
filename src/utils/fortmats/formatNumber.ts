export function formatNumber(num: number): string {
  if (num < 1 || num > 100_000_000_000) {
    throw new Error("Number must be between 1 and 100 billion.");
  }

  const suffixes = [
    {value: 1_000_000_000, suffix: "g"},
    {value: 1_000_000, suffix: "m"},
    {value: 1_000, suffix: "k"},
  ];

  for (const {value, suffix} of suffixes) {
    if (num >= value) {
      const divided = num / value;

      const formatted =
        divided >= 10
          ? Math.floor(divided).toString()
          : divided.toFixed(1);

      return `${formatted}${suffix}`;
    }
  }

  return num.toString();
}